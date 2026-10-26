const club=require('./clubModel'),planning=require('./planningModel');
function create(state,actor,draft,now=Date.now()){
 const row=Object.fromEntries(['title','date','time','location','details'].map(k=>[k,String(draft[k]||'').trim()]));
 if(Object.values(row).some(v=>!v)||!club.validDate(row.date)||row.date<planning.today(now))throw Error('Enter a name, future or current date, time, meeting place and plan.');
 const after={...row,id:club.makeId(),creator:actor,createdAt:now,signups:[actor],unofficial:true};
 return club.audit({...state,memberTrips:[...(state.memberTrips||[]),after]},{type:'Member-led trip created',after},actor,now);
}
function signup(state,id,actor,now=Date.now()){
 const trip=(state.memberTrips||[]).find(t=>t.id===id&&!t.cancelled);if(!trip||trip.date<planning.today(now))throw Error('This trip is closed.');
 const after={...trip,signups:trip.signups.includes(actor)?trip.signups.filter(n=>n!==actor):[...trip.signups,actor]};
 return club.audit({...state,memberTrips:state.memberTrips.map(t=>t.id===id?after:t)},{type:'Member-led trip interest updated',member:actor,before:trip,after},actor,now);
}
function cancel(state,id,actor,role,now=Date.now()){
 const trip=(state.memberTrips||[]).find(t=>t.id===id);if(!trip||(trip.creator!==actor&&role!=='Club Administrator'))throw Error('Only the creator or Club Administrator can cancel this trip.');
 const after={...trip,cancelled:true};return club.audit({...state,memberTrips:state.memberTrips.map(t=>t.id===id?after:t)},{type:'Member-led trip cancelled',before:trip,after,adminOverride:role==='Club Administrator'},actor,now);
}
module.exports={create,signup,cancel};
