const {test}=require('node:test');
const assert=require('node:assert/strict');
const f=require('./workflow');
test('renewal opens on 1 December UK time and targets next year',()=>{
 assert.equal(f.renewalYear(new Date('2026-11-30T23:59:59Z')),null);
 assert.equal(f.renewalYear(new Date('2026-12-01T00:00:00Z')),2027);
 assert.equal(f.renewalYear(new Date('2027-01-01T00:00:00Z')),null);
});
test('driver acceptance consumes capacity and blocks excess or unauthorised acceptance',()=>{
 const offers=[{id:'car',driver:'Driver',spaces:2}];
 let requests=[{id:'a',offerId:'car',member:'A',seats:2,status:'Requested'},{id:'b',offerId:'car',member:'B',seats:1,status:'Requested'}];
 assert.throws(()=>f.acceptLift(offers,requests,'a','Other'));
 requests=f.acceptLift(offers,requests,'a','Driver');
 assert.equal(f.available(offers[0],requests),0);
 assert.throws(()=>f.acceptLift(offers,requests,'b','Driver'));
 assert.throws(()=>f.acceptLift(offers,requests,'a','Driver'));
 requests=requests.map(r=>r.id==='a'?{...r,status:'Cancelled'}:r);
 assert.equal(f.available(offers[0],requests),2);
});
test('bunkhouse hold expires at seven days; paid confirmed places stay reserved',()=>{
 const now=10000;
 const bookings=[{id:'a',status:'Awaiting payment',deadline:now+7*f.DAY},{id:'b',status:'Confirmed'}];
 assert.equal(f.bunkAvailability(2,bookings,now),0);
 assert.equal(f.bunkAvailability(2,bookings,now+7*f.DAY),1);
 assert.throws(()=>f.approveBunk(bookings,'a',true,false,now));
 assert.throws(()=>f.approveBunk(bookings,'a',false,true,now));
 assert.throws(()=>f.approveBunk(bookings,'a',true,true,now+7*f.DAY));
 const approved=f.approveBunk(bookings,'a',true,true,now);
 assert.equal(f.bunkAvailability(2,approved,now+8*f.DAY),0);
});
