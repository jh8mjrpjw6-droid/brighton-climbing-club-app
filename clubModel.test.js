const {test}=require('node:test'),assert=require('node:assert/strict'),m=require('./clubModel'),{initial}=require('./demoClub');
const fresh=()=>JSON.parse(JSON.stringify(initial));
const now=Date.parse('2026-10-25T12:00:00Z');
test('Chair appoints assessors, with audited administrator override; before and after remain audited',()=>{
 const s=fresh();assert.throws(()=>m.appoint(s,'Stu Block','Committee Member','Lewis Small',true,'Reason',now));
 const a=m.appoint(s,'Stephen Wilmot','Chair','Lewis Small',true,'Observed assessment experience',now);
 assert.equal(a.assessors['Lewis Small'].active,true);assert.equal(a.audit.at(-1).actor,'Stephen Wilmot');assert.equal(a.audit.at(-1).at,now);assert.equal(a.audit.at(-1).before,null);
 assert.equal(s.assessors['Lewis Small'],undefined);
});
test('assessment requires active appointment, observation and another member',()=>{
 const d={categories:['tradSecond'],skills:['tradSecond'],observedOn:'2026-10-01',context:'Observed at a crag',notes:'Confident seconding',limitations:'Single pitch'};
 const s=fresh();assert.throws(()=>m.assess(s,'Stu Block','Lewis Small',d,now));assert.throws(()=>m.assess(s,'Alice Denning','Alice Denning',d,now));
 const a=m.assess(s,'Alice Denning','Lewis Small',d,now);assert.equal(a.assessments['Lewis Small'].assessor,'Alice Denning');assert.equal(a.audit.at(-1).before.assessor,'Alice Denning');assert.equal(a.audit.at(-1).after.notes,'Confident seconding');
 const revoked=m.appoint(a,'Stephen Wilmot','Chair','Alice Denning',false,'Authority withdrawn',now);
 assert.throws(()=>m.assess(revoked,'Alice Denning','Lewis Small',d,now));assert.equal(revoked.assessments['Lewis Small'].notes,'Confident seconding');
});
test('member approval projection contains category labels only, never assessment material',()=>{
 const a=m.publicApproval(fresh(),'Stu Block');assert(a.length>0);assert.deepEqual(Object.keys(a[0]),['key','label']);assert(!JSON.stringify(a).includes('Demo observation'));assert(!JSON.stringify(a).includes('Alice Denning'));
 assert.equal(m.canReadPrivate('Member'),false);assert.equal(m.canReadPrivate('Trip Organiser'),true);
});
test('trip categories do not imply another category; specific missing skills highlighted',()=>{
 const s=fresh();assert(m.gaps(s,s.trips.find(t=>t.id==='wales'),'Stu Block').includes('Multi-pitch systems'));assert(m.gaps(s,s.trips.find(t=>t.id==='wales'),'Stu Block').includes('Multi-pitch trad — second only'));assert.equal(m.gaps(s,s.trips.find(t=>t.id==='portland'),'Stu Block').length,0);
});
test('newcomer request is not a booking until organiser accepts and has audit',()=>{
 let s=fresh();assert.throws(()=>m.join(s,'peaks','Jordan Lee',false,now));s=m.join(s,'peaks','Jordan Lee',true,now);assert.equal(s.attendance.peaks.find(a=>a.member==='Jordan Lee').status,'Newcomer requested');
 assert.throws(()=>m.decideNewcomer(s,'peaks','Jordan Lee','Lewis Small','Member',true,'Plan',now));
 s=m.decideNewcomer(s,'peaks','Jordan Lee','Stu Block','Trip Organiser',true,'Suitable arrangements agreed',now);assert.equal(s.attendance.peaks.find(a=>a.member==='Jordan Lee').status,'Newcomer approved');assert.equal(s.audit.at(-1).after.decidedBy,'Stu Block');
});
test('newcomer allocations are reserved within total and pending requests consume them',()=>{
 let s=fresh();s.attendance.peaks=[];s.trips=s.trips.map(t=>t.id==='peaks'?{...t,max:2,newcomerPlaces:1}:t);
 s=m.join(s,'peaks','Stu Block',false,now);assert.throws(()=>m.join(s,'peaks','Lewis Small',false,now),/reserved for newcomers/);s=m.join(s,'peaks','Jordan Lee',true,now);assert.throws(()=>m.join(s,'peaks','New person',true,now));assert.equal(s.attendance.peaks.length,2);
});
test('trip attendance, not booking, creates visible history; future confirmation blocked',()=>{
 let s=fresh();s=m.join(s,'portland','Stu Block',false,now);assert.throws(()=>m.recordAttendance(s,'portland','Stu Block','Stu Block','Trip Organiser',true,[],now));
 assert.equal(m.history(s,'Stu Block').length,1);
 s=m.recordAttendance(s,'past-peaks','Stu Block','Stu Block','Trip Organiser',true,['Lewis Small'],now);
 const h=m.history(s,'Stu Block')[0];assert.deepEqual(h.partners,['Lewis Small']);assert.equal(h.confirmedAt,now);assert(!('notes' in h));
 const categories=s.assessments['Stu Block'].categories;s=m.recordAttendance(s,'past-peaks','Stu Block','Stu Block','Trip Organiser',false,[],now);assert.equal(m.history(s,'Stu Block').length,0);assert.deepEqual(s.assessments['Stu Block'].categories,categories);
});
test('history rejects fabricated partners and preserves attendance audit',()=>{
 const s=fresh();assert.throws(()=>m.recordAttendance(s,'past-peaks','Stu Block','Stu Block','Trip Organiser',true,['Non attendee'],now));const a=m.recordAttendance(s,'past-peaks','Stu Block','Stu Block','Trip Organiser',true,['Alice Denning'],now);assert.equal(a.audit.at(-1).type,'Attendance confirmed');assert.equal(a.audit.at(-1).before.partners.length,2);
});
test('demo international trips have no lift offers or sharing; UK offers are trip-scoped',()=>{
 const s=fresh();const intl=s.trips.filter(t=>t.international);assert.equal(intl.length,2);for(const t of intl){assert.equal(t.liftShare,false);assert.equal(s.services[t.id]?.offers?.length||0,0);assert(t.suggestedFlights);}
 assert(s.services.portland.offers.length===2);assert(s.services.peaks.offers.length===1);assert(s.services.portland.offers.every(o=>o.outward.includes('March')));assert(s.services.peaks.offers.every(o=>o.outward.includes('April')));
});
test('valid dates reject impossible dates',()=>{assert.equal(m.validDate('2027-02-31'),false);assert.equal(m.validDate('2027-02-28'),true);assert.equal(m.validDate('bad'),false);});
test('local persistence round trip retains full approval audit and separate trips',()=>{const s=m.appoint(fresh(),'Stephen Wilmot','Chair','Lewis Small',true,'Demo appointment',now);const r=JSON.parse(JSON.stringify(s));assert.deepEqual(r.audit,s.audit);assert.deepEqual(r.services,s.services);assert.equal(r.schema,1);});
