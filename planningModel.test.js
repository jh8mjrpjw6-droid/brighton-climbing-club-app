const {test}=require('node:test'),assert=require('node:assert/strict');
const p=require('./planningModel'),m=require('./clubModel'),a=require('./access'),w=require('./workflow'),{initial}=require('./demoClub');
const fresh=()=>JSON.parse(JSON.stringify(initial));
test('administrator automatically inherits current and newly introduced feature permissions',()=>{
 assert.deepEqual(a.features('Club Administrator',{members:false,futureFeature:false}),{members:true,futureFeature:true});assert.deepEqual(a.features('Member',{members:false,futureFeature:false}),{members:false,futureFeature:false});
});
test('administrator appoints and assesses with audit override but never self-assesses',()=>{
 let s=fresh(),now=Date.parse('2026-10-25T12:00:00Z');s=m.appoint(s,'Stu Block','Club Administrator','Lewis Small',true,'Admin appointment',now);assert(s.audit.at(-1).adminOverride);
 const decision={categories:['tradSecond'],skills:[],observedOn:'2026-10-24',context:'Observed on rock',notes:'Competent second',limitations:'Single pitch'};
 s=m.assess(s,'Stu Block','Jordan Lee',decision,now,'Club Administrator');assert(s.audit.at(-1).adminOverride);assert.equal(s.assessments['Jordan Lee'].assessor,'Stu Block');assert.throws(()=>m.assess(s,'Stu Block','Stu Block',decision,now,'Club Administrator'));assert.throws(()=>m.assess(s,'Stu Block','Jordan Lee',decision,now,'Member'));
});
test('groups validate authority, dates, confirmed bookings and size and preserve other days',()=>{
 let s=fresh();s=p.saveGroup(s,'peaks','2027-04-16',['Lewis Small','Alice Denning'],null,'Stu Block','Trip Organiser',true,'Alice leads; Lewis seconds.');assert(s.groups.peaks['2027-04-16']);
 const before=JSON.stringify(s.assessments);s=p.saveGroup(s,'peaks','2027-04-17',['Lewis Small','Alice Denning'],null,'Stu Block','Club Administrator',true,'Agreed arrangements');assert(s.groups.peaks['2027-04-16']);assert.equal(JSON.stringify(s.assessments),before);assert.equal(s.audit.at(-1).before.day,'2027-04-17');
 for(const [day,members,role]of[['2027-04-15',['Lewis Small','Alice Denning'],'Club Administrator'],['2027-04-16',['Lewis Small'],'Club Administrator'],['2027-04-16',['Lewis Small','Nobody'],'Club Administrator'],['2027-04-16',['Lewis Small','Alice Denning'],'Member']])assert.throws(()=>p.saveGroup(s,'peaks',day,members,null,'Stu Block',role,true,'Agreed'));
 s=p.removeGroup(s,'peaks','2027-04-17',0,'Stu Block','Club Administrator');assert.equal(s.groups.peaks['2027-04-17'].length,0);assert(s.groups.peaks['2027-04-16']);
});
test('missing approvals require reviewed arrangements and remain missing after pairing',()=>{
 let s=fresh();s.attendance.portland.push({id:'jordan',member:'Jordan Lee',status:'Newcomer requested'});assert.throws(()=>p.saveGroup(s,'portland','2027-03-26',['Alice Denning','Jordan Lee'],null,'Stu Block','Club Administrator',true,'Plan'));
 s.attendance.portland.at(-1).status='Newcomer approved';assert.throws(()=>p.saveGroup(s,'portland','2027-03-26',['Alice Denning','Jordan Lee'],null,'Stu Block','Club Administrator'));
 s=p.saveGroup(s,'portland','2027-03-26',['Alice Denning','Jordan Lee'],null,'Stu Block','Club Administrator',true,'Organiser agreed supported participation');assert(m.gaps(s,s.trips[0],'Jordan Lee').length);assert.equal(s.audit.at(-1).after.requirementsReview[0].member,'Jordan Lee');assert.throws(()=>p.saveGroup(s,'font','2027-06-04',['Alice Denning','Lewis Small'],null,'Stu Block','Club Administrator'));
});
test('administrator lift override keeps capacity checks and records actor',()=>{
 const offers=[{id:'offer',driver:'Driver',spaces:1}],requests=[{id:'r',offerId:'offer',member:'Passenger',seats:1,status:'Requested'}];assert.throws(()=>w.acceptLift(offers,requests,'r','Admin'));
 const next=w.acceptLift(offers,requests,'r','Admin','Club Administrator');assert(next[0].adminOverride);assert.equal(next[0].decidedBy,'Admin');assert.throws(()=>w.acceptLift(offers,[{...requests[0],seats:2}],'r','Admin','Club Administrator'));
});
test('UK date defaults and trip dates handle British summer time',()=>{assert.equal(p.today(Date.parse('2026-07-01T23:30:00Z')),'2026-07-02');assert.equal(p.today(Date.parse('2026-12-01T23:30:00Z')),'2026-12-01');assert.equal(p.days(initial.trips[0]).length,3);});
