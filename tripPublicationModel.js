const club=require('./clubModel'),access=require('./access');
const canPublish=role=>access.allows(role,access.has(role,'Trips Committee','Digital & Media','Digital & Brand Lead'));
function publish(state,tripId,actor,role,now=Date.now()){
 const trip=state.trips.find(t=>t.id===tripId);if(!canPublish(role)||!trip||trip.approvalStatus!=='Pending')throw Error('An authorised publisher must select a pending trip.');
 const after={...trip,approvalStatus:'Approved',approvedBy:actor,approvedAt:now};
 let next=club.audit({...state,trips:state.trips.map(t=>t.id===tripId?after:t)},{type:'Trip published',tripId,before:trip,after,adminOverride:access.isAdmin(role)},actor,now);
 if(after.notify)next=require('./notificationsModel').add(next,require('./accountModel').memberNames(next,true),'New official trip: '+after.title,'trips',now);return next;
}
module.exports={canPublish,publish};
