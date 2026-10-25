// Local TestFlight model. A shared service must enforce the same rules server-side.
const categories = {
 indoorTop:'Indoor — top-rope', indoorLead:'Indoor — lead', indoorBoulder:'Indoor bouldering', outdoorBoulder:'Outdoor bouldering',
 sportTop:'Outdoor sport — top-rope only', sportLead:'Outdoor sport — lead', tradSecond:'Single-pitch trad — second only', tradLead:'Single-pitch trad — lead',
 multiTradSecond:'Multi-pitch trad — second only', multiTradLead:'Multi-pitch trad — lead', multiSportSecond:'Multi-pitch sport — second only', multiSportLead:'Multi-pitch sport — lead',
};
const skills = { topBelay:'Top-rope belaying',leadBelay:'Lead belaying',sportClean:'Cleaning sport anchors',tradSecond:'Seconding trad',multiPitch:'Multi-pitch systems',abseil:'Abseiling',tradLead:'Placing trad protection' };
const privateRoles=['Chair','Committee Member','Trip Organiser','Club Administrator','Secretary','Membership Secretary','Digital & Media','Social & Culture Secretary','Treasurer'];
const canReadPrivate = role => privateRoles.includes(role);
const canManageTrip = (trip,actor,role) => role==='Chair'||role==='Club Administrator'||(role==='Trip Organiser'&&trip.organisers.includes(actor));
const canAssess = (state,actor) => !!state.assessors[actor]?.active;
const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
const makeId=()=>`${Date.now()}-${Math.random().toString(36).slice(2)}`;
function audit(state,event,actor,now=Date.now()) {
 return {...state,audit:[...state.audit,{...event,id:makeId(),actor,at:now}]};
}
function appoint(state,actor,role,member,active,reason,now=Date.now()) {
 if(role!=='Chair')throw Error('Only the Chair can appoint or remove assessors.');
 if(!reason.trim())throw Error('Record the reason for the change.');
 const before=state.assessors[member]||null;
 return audit({...state,assessors:{...state.assessors,[member]:{active,appointedBy:actor,appointedAt:now,reason}}},{type:active?'Assessor appointed':'Assessor removed',member,before,after:{active,reason}},actor,now);
}
function assess(state,actor,member,decision,now=Date.now()) {
 if(!canAssess(state,actor))throw Error('Only a currently Chair-appointed assessor can record competence.');
 if(actor===member)throw Error('Assessments must be recorded by another appointed assessor.');
 if(!decision.notes.trim()||!decision.observedOn||!decision.context.trim())throw Error('Record observation date, context and private notes.');
 if(!validDate(decision.observedOn)||decision.observedOn>new Date(now).toISOString().slice(0,10))throw Error('Use an observation date in YYYY-MM-DD format, no later than today.');
 if(decision.categories.some(c=>!categories[c])||decision.skills.some(c=>!skills[c]))throw Error('Unknown category or skill.');
 const after={...decision,categories:[...decision.categories],skills:[...decision.skills],assessor:actor,at:now};
 return audit({...state,assessments:{...state.assessments,[member]:after}},{type:'Competence decision',member,before:state.assessments[member]||null,after},actor,now);
}
function publicApproval(state,member) { return (state.assessments[member]?.categories||[]).map(key=>({key,label:categories[key]})); }
function gaps(state,trip,member) {
 const a=state.assessments[member]||{categories:[],skills:[]};
 return [...(trip.requiredCategories||[]).filter(k=>!a.categories.includes(k)).map(k=>categories[k]),...(trip.requiredSkills||[]).filter(k=>!a.skills.includes(k)).map(k=>skills[k])];
}
function join(state,tripId,member,newcomer=false,now=Date.now()) {
 const trip=state.trips.find(t=>t.id===tripId);if(!trip)throw Error('Trip not found.');
 if(trip.endDate<new Date(now).toISOString().slice(0,10))throw Error('This trip has finished.');
 const arr=state.attendance[tripId]||[];
 if(arr.some(a=>a.member===member&&!['Cancelled','Declined'].includes(a.status)))throw Error('You already have a place or request on this trip.');
 if(!newcomer&&gaps(state,trip,member).length)throw Error('Your profile does not yet meet this trip’s confirmed requirements.');
 if(newcomer&&!(Number(trip.newcomerPlaces)>0&&trip.newcomerPlan?.trim()))throw Error('This trip does not offer newcomer places.');
 const holds=arr.filter(a=>['Booked','Newcomer requested','Newcomer approved'].includes(a.status));
 if(holds.length>=Number(trip.max))throw Error('This trip is full.');
 const newHolds=holds.filter(a=>a.newcomer).length;
 if(newcomer&&newHolds>=Number(trip.newcomerPlaces))throw Error('All newcomer places are taken or awaiting approval.');
 // Newcomer places are an allocation within the total, not extra places.
 if(!newcomer&&holds.filter(a=>!a.newcomer).length>=Number(trip.max)-Number(trip.newcomerPlaces||0))throw Error('The remaining places are reserved for newcomers.');
 const entry={id:makeId(),member,newcomer,status:newcomer?'Newcomer requested':'Booked',at:now};
 return audit({...state,attendance:{...state.attendance,[tripId]:[...arr.filter(a=>a.member!==member||!['Cancelled','Declined'].includes(a.status)),entry]}},{type:newcomer?'Newcomer requested':'Trip joined',member,tripId,after:entry},member,now);
}
function decideNewcomer(state,tripId,member,actor,role,accept,note,now=Date.now()) {
 const trip=state.trips.find(t=>t.id===tripId);if(!canManageTrip(trip,actor,role))throw Error('Only an organiser or authorised trip manager can decide requests.');
 if(!note.trim())throw Error('Record the arrangements or reason for this decision.');
 const arr=state.attendance[tripId]||[];const before=arr.find(a=>a.member===member&&a.status==='Newcomer requested');if(!before)throw Error('No pending request.');
 const after={...before,status:accept?'Newcomer approved':'Declined',organiserNote:note,decidedBy:actor,decidedAt:now};
 return audit({...state,attendance:{...state.attendance,[tripId]:arr.map(a=>a.id===before.id?after:a)}},{type:accept?'Newcomer approved':'Newcomer declined',member,tripId,before,after},actor,now);
}
function recordAttendance(state,tripId,member,actor,role,attended,partners,now=Date.now()) {
 const trip=state.trips.find(t=>t.id===tripId);if(!canManageTrip(trip,actor,role))throw Error('Only the organiser can confirm attendance.');
 if(trip.startDate>new Date(now).toISOString().slice(0,10))throw Error('Attendance can be confirmed from the trip start date.');
 const arr=state.attendance[tripId]||[];const before=arr.find(a=>a.member===member);
 if(!before||!['Booked','Newcomer approved','Attended','Did not attend'].includes(before.status))throw Error('Confirm the member’s booking first.');
 const allowed=arr.filter(a=>a.member!==member&&['Booked','Newcomer approved','Attended'].includes(a.status)).map(a=>a.member);
 if(partners.some(p=>!allowed.includes(p)))throw Error('Choose partners from this trip’s attendees.');
 const after={...before,status:attended?'Attended':'Did not attend',partners:attended?partners:[],confirmedBy:actor,confirmedAt:now};
 return audit({...state,attendance:{...state.attendance,[tripId]:arr.map(a=>a.id===before.id?after:a)}},{type:'Attendance confirmed',member,tripId,before,after},actor,now);
}
function history(state,member) { return state.trips.flatMap(t=>(state.attendance[t.id]||[]).filter(a=>a.member===member&&a.status==='Attended').map(a=>({tripId:t.id,title:t.title,dates:t.dates,types:t.types,partners:a.partners||[],confirmedBy:a.confirmedBy,confirmedAt:a.confirmedAt,...(state.experience[member]?.tripNotes?.[t.id]||{})}))); }
module.exports={validDate,categories,skills,privateRoles,canReadPrivate,canManageTrip,canAssess,appoint,assess,publicApproval,gaps,join,decideNewcomer,recordAttendance,history,audit,makeId};
