const m=require('./clubModel'),c=require('./communicationsModel'),DAY=86400000;
const boulderKeys=['indoorBoulder','outdoorBoulder'];
const isBoulder=t=>t?.types?.includes('Bouldering');
const canManage=(trip,actor,role)=>m.canManageTrip(trip,actor,role)||(m.canReadPrivate(role)&&role!=='Trip Organiser');
const active=(r,now)=>r.status==='Confirmed'||(r.status==='Awaiting payment'&&r.deadline>now);
function available(state,tripId,now=Date.now()){const t=state.trips.find(t=>t.id===tripId);return Math.max(0,Number(t?.matStock||0)-(state.matReservations||[]).filter(r=>r.tripId===tripId&&active(r,now)).reduce((n,r)=>n+r.quantity,0));}
function bankReady(bank){return !!bank?.accountName?.trim()&&/^\d{6}$/.test((bank.sortCode||'').replace(/\D/g,''))&&/^\d{8}$/.test(bank.accountNumber||'');}
function validateConfig(trip,reservations=[],now=Date.now()){
 const held=reservations.filter(r=>r.tripId===trip.id&&active(r,now)).reduce((n,r)=>n+r.quantity,0);
 if(held&&(!trip.matHire||!isBoulder(trip)||Number(trip.matStock)<held))throw Error('Resolve existing mat reservations before disabling hire or reducing stock below reserved quantities.');
 if(trip.matHire&&(!isBoulder(trip)||!Number.isSafeInteger(Number(trip.matStock))||Number(trip.matStock)<1||!Number.isFinite(Number(trip.matPrice))||Number(trip.matPrice)<=0||!Number.isSafeInteger(Math.round(Number(trip.matPrice)*100)*Number(trip.matStock))||!/^\d+(\.\d{1,2})?$/.test(String(trip.matPrice))))throw Error('For mat hire, choose Bouldering, a positive whole number of mats and a price per mat for the whole trip (up to two decimal places).');
 return trip;
}
function reserve(state,tripId,actor,quantity,now=Date.now()){
 const t=state.trips.find(t=>t.id===tripId);if(!t?.matHire||!isBoulder(t)||t.approvalStatus!=='Approved'||c.tripEnd(t)<=now)throw Error('Mat hire is not available for this trip.');validateConfig(t);
 if(!(state.attendance[tripId]||[]).some(a=>a.member===actor&&['Booked','Newcomer approved'].includes(a.status)))throw Error('Join and confirm your trip place before reserving mats.');
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>available(state,tripId,now))throw Error('Choose a whole number of available mats.');
 if((state.matReservations||[]).some(r=>r.tripId===tripId&&r.member===actor&&active(r,now)))throw Error('You already have an active reservation. Cancel it before changing quantity.');
 if(!bankReady(state.paymentSettings))throw Error('The organiser or administrator must set the club bank details before reservations can be taken.');
 const pricePence=Math.round(Number(t.matPrice)*100),id=m.makeId(),r={id,tripId,member:actor,quantity,pricePence,totalPence:quantity*pricePence,status:'Awaiting payment',at:now,deadline:Math.min(now+7*DAY,c.tripEnd(t)),reference:'MATS-'+id.replace(/[^a-z0-9]/gi,'').slice(-10).toUpperCase(),bank:{accountName:state.paymentSettings.accountName,sortCode:state.paymentSettings.sortCode,accountNumber:state.paymentSettings.accountNumber}};
 let next=m.audit({...state,matReservations:[...(state.matReservations||[]),r]},{type:'Mat reservation requested',tripId,member:actor,after:r},actor,now);
 return {...next,notifications:[...(next.notifications||[]),...t.organisers.map(to=>({id:m.makeId(),to,at:now,message:`${actor} reserved ${quantity} mat(s) for ${t.title}. Payment needs confirmation.`}))]};
}
function approve(state,id,actor,role,paid,now=Date.now()){
 const r=(state.matReservations||[]).find(r=>r.id===id),t=state.trips.find(t=>t.id===r?.tripId);
 if(!r||!t||!canManage(t,actor,role)||!paid||r.status!=='Awaiting payment'||r.deadline<=now)throw Error('Approval requires authorised access, confirmed bank payment and an unexpired reservation.');
 const after={...r,status:'Confirmed',confirmedBy:actor,confirmedAt:now};return m.audit({...state,notifications:[...(state.notifications||[]),{id:m.makeId(),to:r.member,at:now,message:`Your ${r.quantity} mat(s) for ${t.title} are confirmed.`}],matReservations:state.matReservations.map(x=>x.id===id?after:x)},{type:'Mat payment confirmed',tripId:r.tripId,member:r.member,before:r,after,adminOverride:role==='Club Administrator'},actor,now);
}
function cancel(state,id,actor,role,now=Date.now()){
 const r=(state.matReservations||[]).find(r=>r.id===id),t=state.trips.find(t=>t.id===r?.tripId);if(!r||!t||(!canManage(t,actor,role)&&!(actor===r.member&&r.status==='Awaiting payment'))||r.status==='Cancelled')throw Error('Contact the organiser to change a paid reservation.');
 const after={...r,status:'Cancelled',cancelledAt:now,cancelledBy:actor};return m.audit({...state,notifications:[...(state.notifications||[]),...[...new Set([r.member,...t.organisers])].map(to=>({id:m.makeId(),to,at:now,message:`Mat reservation for ${r.member} on ${t.title} cancelled. Check any payment or refund separately.`}))],matReservations:state.matReservations.map(x=>x.id===id?after:x)},{type:'Mat reservation cancelled',tripId:r.tripId,member:r.member,before:r,after,adminOverride:role==='Club Administrator'},actor,now);
}
function migrate(state){
 if(state.usability19Migrated)return state;
 const trips=state.trips.map(t=>({...t,requiredCategories:(t.requiredCategories||[]).filter(k=>!boulderKeys.includes(k))}));
 const assessments=Object.fromEntries(Object.entries(state.assessments||{}).map(([n,a])=>[n,{...a,categories:(a.categories||[]).filter(k=>!boulderKeys.includes(k))}]));
 const before={requirements:state.trips.filter(t=>(t.requiredCategories||[]).some(k=>boulderKeys.includes(k))).map(t=>({tripId:t.id,categories:t.requiredCategories})),assessments:Object.fromEntries(Object.entries(state.assessments||{}).filter(([,a])=>a.categories?.some(k=>boulderKeys.includes(k))))};
 return m.audit({...state,trips,assessments,usability19Migrated:true,messages:[],threads:[],messageRead:{},notifications:(state.notifications||[]).filter(n=>!n.threadId)},{type:'Bouldering approval and messaging privacy migration',before,after:{boulderingRequiresApproval:false,legacyPlaintextDemoMessagesRemoved:true}},'System');
}
module.exports={isBoulder,canManage,available,bankReady,validateConfig,reserve,approve,cancel,migrate};
