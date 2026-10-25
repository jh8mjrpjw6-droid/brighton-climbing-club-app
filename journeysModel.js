const club=require('./clubModel'),events=require('./eventsModel'),planning=require('./planningModel');
const liveBooking=a=>!['Cancelled','Declined','Did not attend'].includes(a.status);
function bookings(state,actor,role,now=Date.now()){
 const visible=events.build(state,actor,role,now),today=planning.today(now);
 return visible.flatMap(e=>{const row=e.mainTrip?(state.attendance[e.id]||[]).find(a=>a.member===actor&&liveBooking(a)):state.eventResponses?.[e.id]?.[actor];if(!row||(!e.mainTrip&&!row.attending))return [];return [{...e,status:e.mainTrip?row.status:'Attending',past:(e.endIso||e.iso)<today}];});
}
function payments(state,actor,now=Date.now()){
 const result=[];for(const t of state.trips){for(const r of (state.services?.[t.id]?.bookings||[]).filter(r=>r.member===actor)){result.push({id:'bunk-'+r.id,tripId:t.id,title:t.title,kind:'Accommodation',amount:Number.isFinite(Number(r.price))?Number(r.price):null,status:r.status==='Awaiting payment'&&r.deadline<=now?'Expired':r.status,deadline:r.deadline,reference:r.reference,focus:'Accommodation'});}}
 for(const r of (state.matReservations||[]).filter(r=>r.member===actor)){const t=state.trips.find(t=>t.id===r.tripId);if(t)result.push({id:'mat-'+r.id,tripId:t.id,title:t.title,kind:'Mat hire',amount:r.totalPence/100,status:r.status==='Awaiting payment'&&r.deadline<=now?'Expired':r.status,deadline:r.deadline,reference:r.reference,focus:'Mats'});}
 for(const r of (state.renewals||[]).filter(r=>r.member===actor))result.push({id:'renewal-'+r.id,title:`${r.year} membership`,kind:'Membership renewal',amount:Number.isFinite(Number(r.price))?Number(r.price):null,status:r.status,reference:r.reference,focus:'Membership'});
 return result.sort((a,b)=>Number(b.status==='Awaiting payment')-Number(a.status==='Awaiting payment')||(a.deadline||Infinity)-(b.deadline||Infinity));
}
function arrangements(state,trip,actor,now=Date.now()){
 const svc=state.services?.[trip.id]||{},mine=(state.attendance[trip.id]||[]).find(a=>a.member===actor&&liveBooking(a)),out=[];
 if(mine)out.push({kind:'Trip place',status:mine.status,detail:mine.status==='Newcomer requested'?'Awaiting organiser decision':'Your trip place is recorded'});
 if(trip.liftShare&&!trip.international){const r=(svc.requests||[]).find(r=>r.member===actor&&['Requested','Accepted'].includes(r.status)),offer=(svc.offers||[]).find(o=>o.driver===actor);out.push({kind:'Travel & lifts',status:offer?'Offering a lift':r?.status==='Accepted'?'Confirmed':r?'Awaiting driver':'Not arranged',detail:offer?`${offer.spaces} passenger spaces offered`:r?'Driver confirmation is required':'Optional',focus:'Travel'});}
 if(trip.bunk){const r=(svc.bookings||[]).filter(r=>r.member===actor).at(-1);out.push({kind:'Accommodation',status:r?(r.status==='Awaiting payment'&&r.deadline<=now?'Expired':r.status):'Not reserved',detail:r?.status==='Awaiting payment'?'View bank transfer details':'Optional',focus:'Accommodation'});}
 if(trip.matHire&&trip.types.includes('Bouldering')){const r=(state.matReservations||[]).filter(r=>r.tripId===trip.id&&r.member===actor).at(-1);out.push({kind:'Hire bouldering mats',status:r?(r.status==='Awaiting payment'&&r.deadline<=now?'Expired':r.status):'Not reserved',detail:r?`${r.quantity} mat(s)`:'Optional',focus:'Mats'});}
 if(trip.social){const r=state.meals?.[trip.id]?.[actor];out.push({kind:'Group meal',status:r?(r.attending?(r.main?'Choices saved':'Choose food'):'Not attending'):'Choose attendance',detail:trip.mealDate,focus:'Meal'});}
 if(mine&&!trip.international){const p=state.preferences?.[trip.id]?.[actor];out.push({kind:'My climbing partner preferences',status:p?.partner?'Preference saved':'Review arrangements',detail:p?.partner||'The organiser confirms groups',focus:'Preferences'});}
 return out;
}
module.exports={bookings,payments,arrangements};
function respond(state,eventId,actor,role,attending,now=Date.now()){
 const event=events.build(state,actor,role,now).find(e=>e.id===eventId);if(!event||event.mainTrip)throw Error('Open a visible club event to record attendance.');
 const before=state.eventResponses?.[eventId]?.[actor]||null,after={attending:!!attending,updatedAt:now};
 const next=club.audit({...state,eventResponses:{...state.eventResponses,[eventId]:{...state.eventResponses?.[eventId],[actor]:after}}},{type:'Event attendance response',eventId,member:actor,before,after},actor,now);
 const recipients=event.type==='Social'?Object.entries(state.roleAssignments||{}).filter(([,roles])=>roles.includes('Social & Culture Secretary')).map(([name])=>name):[];
 return {...next,notifications:[...(next.notifications||[]),...recipients.map(to=>({id:club.makeId(),to,at:now,message:`${actor}: ${attending?'attending':'not attending'} ${event.title}.`}))]};
}
module.exports.respond=respond;
