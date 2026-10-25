const model=require('./clubModel');
const today=(now=Date.now())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
function days(trip){const out=[];for(let d=new Date(trip.startDate+'T12:00:00Z');d<=new Date(trip.endDate+'T12:00:00Z')&&out.length<366;d.setUTCDate(d.getUTCDate()+1))out.push(d.toISOString().slice(0,10));return out;}
function attendees(state,tripId,day){const trip=state.trips.find(t=>t.id===tripId),groups=state.groups?.[tripId]?.[day]||[];return(state.attendance[tripId]||[]).filter(a=>['Booked','Newcomer approved','Attended'].includes(a.status)).map(a=>({...a,missing:model.gaps(state,trip,a.member),groups:groups.flatMap((g,i)=>g.includes(a.member)?[i]:[]),preference:state.preferences?.[tripId]?.[a.member]||{}}));}
function saveGroup(state,tripId,day,members,index,actor,role,reviewed=false,reason=''){
 const trip=state.trips.find(t=>t.id===tripId);if(!trip||!model.canManageTrip(trip,actor,role))throw Error('Only the assigned organiser or authorised trip manager can change groups.');
 if(trip.international)throw Error('International trips do not use climbing pairings.');if(!days(trip).includes(day))throw Error('Choose a climbing day within the trip.');
 const rows=attendees(state,tripId,day),current=state.groups?.[tripId]?.[day]||[];
 if(index!==null&&(!Number.isInteger(index)||!current[index]))throw Error('This group has changed. Open it again.');
 if(new Set(members).size!==members.length||members.length<2||members.some(n=>!rows.some(a=>a.member===n)))throw Error('Choose at least two confirmed attendees.');
 const missing=rows.filter(a=>members.includes(a.member)&&a.missing.length).map(a=>({member:a.member,missing:a.missing}));
 if(missing.length&&(!reviewed||!reason.trim()))throw Error('Review missing approvals and record the participation arrangements. Pairing does not grant approval.');
 const next=index===null?[...current,[...members]]:current.map((g,i)=>i===index?[...members]:g);
 return model.audit({...state,groups:{...state.groups,[tripId]:{...state.groups?.[tripId],[day]:next}}},{type:'Climbing groups updated',tripId,before:{day,groups:current},after:{day,groups:next,requirementsReview:missing,arrangements:reason}},actor);
}
function removeGroup(state,tripId,day,index,actor,role){const trip=state.trips.find(t=>t.id===tripId);if(!trip||!model.canManageTrip(trip,actor,role)||trip.international)throw Error('Only the assigned organiser or authorised trip manager can change groups.');const current=state.groups?.[tripId]?.[day]||[];if(!current[index])throw Error('Group not found.');const next=current.filter((_,i)=>i!==index);return model.audit({...state,groups:{...state.groups,[tripId]:{...state.groups?.[tripId],[day]:next}}},{type:'Climbing groups removed',tripId,before:{day,groups:current},after:{day,groups:next}},actor);}
module.exports={today,days,attendees,saveGroup,removeGroup};
