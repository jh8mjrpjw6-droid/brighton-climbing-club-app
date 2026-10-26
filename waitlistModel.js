const club=require('./clubModel'),accounts=require('./accountModel');
function places(state,trip,newcomer){const rows=(state.attendance[trip.id]||[]).filter(a=>['Booked','Newcomer requested','Newcomer approved'].includes(a.status));return Math.max(0,Math.min(Number(trip.max)-rows.length,newcomer?Number(trip.newcomerPlaces||0)-rows.filter(a=>a.newcomer).length:Number(trip.max)-Number(trip.newcomerPlaces||0)-rows.filter(a=>!a.newcomer).length));}
function enqueue(state,tripId,member,newcomer,phone,confirmed,consented,now=Date.now()){
 accounts.requireMember(state,member,now);const trip=state.trips.find(t=>t.id===tripId);
 if(!trip||trip.approvalStatus!=='Approved'||trip.endDate<require('./planningModel').today(now))throw Error('This trip is not open.');
 if((state.attendance[tripId]||[]).some(a=>a.member===member&&!['Cancelled','Declined'].includes(a.status)))throw Error('You already have a booking or waiting-list request.');
 if(places(state,trip,newcomer)>0)throw Error('A place is available. Use the normal trip signup.');
 if(newcomer&&!(Number(trip.newcomerPlaces)>0&&trip.newcomerPlan?.trim()))throw Error('This trip does not offer newcomer places.');
 if(!newcomer&&club.gaps(state,trip,member).length)throw Error('Request a newcomer place or arrange an assessment first.');
 const comm=require('./communicationsModel');if(!confirmed||!consented)throw Error('Confirm your WhatsApp number and group consent.');const number=comm.phoneNumber(phone);
 const after={id:club.makeId(),member,status:'Waitlisted',newcomer,at:now};
 return club.audit({...state,attendance:{...state.attendance,[tripId]:[...(state.attendance[tripId]||[]),after]},tripContacts:{...state.tripContacts,[tripId]:{...state.tripContacts?.[tripId],[member]:{phone:number,consentedAt:now,consentText:comm.CONSENT,numberConfirmed:true,addedAt:null,addedBy:null}}}},{type:'Waiting list joined',tripId,member,after},member,now);
}
function promote(state,tripId,member,actor,role,now=Date.now()){
 const trip=state.trips.find(t=>t.id===tripId);if(!trip||!club.canManageTrip(trip,actor,role))throw Error('Only an authorised trip manager can offer a place.');
 const before=(state.attendance[tripId]||[]).find(a=>a.member===member&&a.status==='Waitlisted');if(!before)throw Error('No waiting-list request.');
 const first=(state.attendance[tripId]||[]).filter(a=>a.status==='Waitlisted'&&a.newcomer===before.newcomer).sort((a,b)=>a.at-b.at)[0];if(first.id!==before.id)throw Error('Offer the earliest waiting member in this allocation first.');
 const clean={...state,attendance:{...state.attendance,[tripId]:state.attendance[tripId].filter(a=>a.id!==before.id)}};
 let next=club.join(clean,tripId,member,before.newcomer,now);
 next=club.audit(next,{type:'Waiting list place offered',tripId,member,before,after:next.attendance[tripId].find(a=>a.member===member),adminOverride:require('./access').isAdmin(role)},actor,now);
 return {...next,notifications:[...(next.notifications||[]),{id:club.makeId(),to:member,at:now,message:`${trip.title}: ${before.newcomer?'a newcomer place is available, pending organiser approval':'you have a trip place from the waiting list'}.`}]};
}
module.exports={places,enqueue,promote};
