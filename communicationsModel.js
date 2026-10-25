const m=require('./clubModel'),DAY=86400000;
const members=['Stu Block','Stephen Wilmot','Alice Denning','Alasdair McGregor','Lukas Koch','Miran Bray','Lewis Small','Eddie Shaw','Colin Glenny','Tom Harriot','Matt Barnes-Smith','Jordan Lee'];
function tripEnd(trip){if(!m.validDate(trip?.endDate))throw Error('Trip end date is missing.');const midnight=Date.parse(trip.endDate+'T00:00:00Z')+DAY;const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',hourCycle:'h23'}).format(midnight));return midnight-hour*3600000;}
function prune(state,now=Date.now()){
 const messages=(state.messages||[]).filter(x=>x.expiresAt>now),ids=new Set(messages.map(x=>x.threadId));
 const threads=(state.threads||[]).filter(x=>ids.has(x.id)),notifications=(state.notifications||[]).filter(n=>!n.expiresAt||n.expiresAt>now);
 if(messages.length===(state.messages||[]).length&&threads.length===(state.threads||[]).length&&notifications.length===(state.notifications||[]).length)return state;
 return {...state,messages,threads,notifications};
}
function allowed(state,actor,recipients,kind,tripId,offerId){
 if(!members.includes(actor)||!recipients.length||recipients.some(n=>!members.includes(n)||n===actor))throw Error('Choose another club member.');
 if(kind==='direct'){if(recipients.length!==1)throw Error('Direct messaging is one-to-one.');if(recipients.some(n=>state.privacy?.[n]?.contactable===false||state.privacy?.[n]?.directoryVisible===false))throw Error('This member is not accepting direct messages.');}
 else if(kind==='organiser'){
  const trip=state.trips.find(t=>t.id===tripId);if(!trip)throw Error('Trip not found.');
  if(!trip.organisers.includes(actor)&&recipients.some(n=>!trip.organisers.includes(n)))throw Error('Choose an organiser for this trip.');
 }else if(kind==='lift'){
  const trip=state.trips.find(t=>t.id===tripId),svc=state.services?.[tripId];if(!trip||trip.international||!trip.liftShare)throw Error('Lift messaging is only available for enabled UK trips.');
  const offer=svc?.offers.find(o=>o.id===offerId);if(!offer)throw Error('This lift is no longer available.');
  const all=[actor,...recipients];if(all.length!==2||!all.includes(offer.driver))throw Error('Lift messages are between the driver and passenger.');
  const passenger=all.find(n=>n!==offer.driver);if(!svc.requests.some(r=>r.offerId===offerId&&r.member===passenger&&['Requested','Accepted','Declined','Cancelled'].includes(r.status)))throw Error('Request this lift before starting a conversation.');
 }else throw Error('Unknown conversation type.');
}
function send(){throw Error('Private messaging is unavailable until end-to-end encryption is connected.');}

function visibleMessages(state,actor,threadId,now=Date.now()){const thread=(state.threads||[]).find(t=>t.id===threadId);if(!thread||!thread.participants.includes(actor))return [];return(state.messages||[]).filter(m=>m.threadId===threadId&&m.expiresAt>now);}
function phoneNumber(value){const result=String(value||'').replace(/[\s()-]/g,'');if(!/^\+?\d{8,15}$/.test(result))throw Error('Enter a valid WhatsApp number, including country code if outside the UK.');return result;}
const CONSENT='I agree to join this trip’s WhatsApp group and understand that my phone number will be visible to other group members.';
function joinWithWhatsApp(state,tripId,actor,newcomer,phone,confirmed,consented,now=Date.now()){
 if(!confirmed||!consented)throw Error('Confirm your number and agree to the trip WhatsApp group before joining.');const number=phoneNumber(phone);
 let next=m.join(state,tripId,actor,newcomer,now),contact={phone:number,consentedAt:now,consentText:CONSENT,numberConfirmed:true,addedAt:null,addedBy:null};
 next=m.audit({...next,tripContacts:{...next.tripContacts,[tripId]:{...next.tripContacts?.[tripId],[actor]:contact}}},{type:'WhatsApp consent recorded',tripId,member:actor,after:contact},actor,now);
 const missing=m.gaps(state,state.trips.find(t=>t.id===tripId),actor);if(missing.length)next=m.audit(next,{type:'Requirements flagged',tripId,member:actor,after:{missing,newcomer}},actor,now);
 const trip=state.trips.find(t=>t.id===tripId);return {...next,notifications:[...(next.notifications||[]),...trip.organisers.map(to=>({id:m.makeId(),to,message:`${actor} signed up for ${trip.title}; WhatsApp number confirmed. Add manually after checking the booking.`,at:now}))]};
}
function markWhatsApp(state,tripId,member,actor,role,now=Date.now()){
 const trip=state.trips.find(t=>t.id===tripId);if(!m.canManageTrip(trip,actor,role)&&!m.canReadPrivate(role))throw Error('Only organisers and committee can record WhatsApp addition.');
 const before=state.tripContacts?.[tripId]?.[member];if(!before?.consentedAt)throw Error('No recorded WhatsApp consent.');
 if(!(state.attendance[tripId]||[]).some(a=>a.member===member&&['Booked','Newcomer approved','Attended'].includes(a.status)))throw Error('Approve the booking before adding the member to WhatsApp.');
 if(before.addedAt)throw Error('Already recorded as added.');const after={...before,addedAt:now,addedBy:actor};
 return m.audit({...state,tripContacts:{...state.tripContacts,[tripId]:{...state.tripContacts[tripId],[member]:after}}},{type:'Added to WhatsApp',tripId,member,before,after},actor,now);
}
function eventGroup(type){return /lift/i.test(type)?'Lifts':/mat reservation|mat payment/i.test(type)?'Mat hire':/bunk|payment/i.test(type)?'Accommodation':/WhatsApp/.test(type)?'WhatsApp':/requirements|competence/i.test(type)?'Requirements':/partner|group/i.test(type)?'Partners':/attendance/i.test(type)?'Attendance':/newcomer|joined|withdraw|sign/i.test(type)?'Sign-ups':'Other';}
function tripEvents(state,tripId,actor,role,{query='',type='All',from='',to=''}={}){
 if(!m.canReadPrivate(role))return [];
 const q=query.trim().toLowerCase();return(state.audit||[]).filter(e=>e.tripId===tripId).filter(e=>type==='All'||eventGroup(e.type)===type).filter(e=>(!from||new Date(e.at).toISOString().slice(0,10)>=from)&&(!to||new Date(e.at).toISOString().slice(0,10)<=to)).filter(e=>!q||[e.type,e.member,e.actor,JSON.stringify(e.after)].join(' ').toLowerCase().includes(q)).sort((a,b)=>b.at-a.at);
}
function actionCounts(state,tripId){
 const trip=state.trips.find(t=>t.id===tripId);if(!trip)return {requests:0,partners:0,requirements:0,whatsApp:0,lifts:0};
 const attendance=(state.attendance[tripId]||[]),active=attendance.filter(a=>['Booked','Newcomer approved'].includes(a.status)),svc=state.services?.[tripId]||{requests:[],bookings:[]};
 const assigned=new Set(Object.values(state.groups?.[tripId]||{}).flat(2));
 const partners=trip.international?0:active.filter(a=>{const p=state.preferences?.[tripId]?.[a.member];return !assigned.has(a.member)&&!p?.partner&&!(p?.sameThroughout===false&&Object.values(p.dayPartners||{}).some(Boolean));}).length;
 return {requests:attendance.filter(a=>a.status==='Newcomer requested').length+(svc.bookings||[]).filter(b=>b.status==='Awaiting payment'&&b.deadline>Date.now()).length,partners,requirements:active.filter(a=>m.gaps(state,trip,a.member).length).length,whatsApp:active.filter(a=>state.tripContacts?.[tripId]?.[a.member]?.consentedAt&&!state.tripContacts[tripId][a.member].addedAt).length,mats:(state.matReservations||[]).filter(r=>r.tripId===tripId&&r.status==='Awaiting payment'&&r.deadline>Date.now()).length,lifts:(svc.requests||[]).filter(r=>r.status==='Requested').length};
}
module.exports={DAY,members,CONSENT,tripEnd,prune,allowed,send,visibleMessages,phoneNumber,joinWithWhatsApp,markWhatsApp,eventGroup,tripEvents,actionCounts};
