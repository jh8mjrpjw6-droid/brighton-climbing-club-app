const model=require('./clubModel'),planning=require('./planningModel');
// Preserve historical demo meetings, courses and socials. Both views consume this source.
const publicEvents=[
    {id:'club-1',day:1,date:'1 March 2027',title:'Monday club night',type:'Club night',location:'High Sports Brighton',time:'19:00',description:'Weekly social climbing. Members can mark whether they are attending.'},
    {id:'club-8',day:8,date:'8 March 2027',title:'Monday club night',type:'Club night',location:'High Sports Brighton',time:'19:00',description:'Weekly social climbing. Members can mark whether they are attending.'},
    {id:'course-13',day:13,date:'13 March 2027',title:'Outdoor skills workshop',type:'Course',location:'Harrison\'s Rocks',time:'10:00',description:'A partner-led outdoor skills and movement session.'},
    {id:'club-15',day:15,date:'15 March 2027',title:'Monday club night',type:'Club night',location:'High Sports Brighton',time:'19:00',description:'Weekly social climbing. Members can mark whether they are attending.'},
    {id:'agm-20',day:20,date:'20 March 2027',title:'Brighton Climbing Club AGM',type:'AGM',location:'Brighton Community Centre - main hall',time:'19:00',description:'The annual general meeting is open to all members. Please respond Yes or No so the committee can plan the room.'},
    {id:'club-22',day:22,date:'22 March 2027',title:'Monday club night',type:'Club night',location:'High Sports Brighton',time:'19:00',description:'Weekly social climbing. Members can mark whether they are attending.'},
    {id:'social-25',day:25,date:'25 March 2027',title:'Club social',type:'Social',location:'Brighton',time:'19:30',description:'An informal evening for members, new joiners and friends of the club.'},
    {id:'club-29',day:29,date:'29 March 2027',title:'Monday club night',type:'Club night',location:'High Sports Brighton',time:'19:00',description:'Weekly social climbing. Members can mark whether they are attending.'},
  ];
const committeeEvents=[{id:'committee-18',day:18,date:'18 March 2027',title:'BCC committee meeting',type:'Committee meeting',location:'High Sports Brighton - meeting room',time:'19:00',description:'A private committee meeting. This entry and its attendance responses are visible only to committee members.',committeeOnly:true}];
function build(state,actor,role,now=Date.now()){
 const today=planning.today(now),canSeeCommittee=model.canReadPrivate(role),month=state.ui?.[actor]?.calendarMonth||'2027-03';
 const seed=[...publicEvents,...committeeEvents].map(e=>({...e,iso:'2027-03-'+String(e.day).padStart(2,'0'),demo:true}));
 const dates=new Map(seed.filter(e=>e.type==='Club night').map(e=>[e.iso,e]));
 const addMondays=(start,end)=>{for(let d=new Date(start+'T12:00:00Z');d<=new Date(end+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1)){if(d.getUTCDay()!==1)continue;const iso=d.toISOString().slice(0,10);if(!dates.has(iso))dates.set(iso,{id:'club-'+iso,iso,date:d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/London'}),day:d.getUTCDate(),title:'Monday club night',type:'Club night',location:'High Sports Brighton',time:'19:00',description:'Demo weekly club meet. Check club announcements for any date-specific changes.',demo:true});}};
 const start=new Date(today+'T12:00:00Z'),end=new Date(start);start.setUTCDate(start.getUTCDate()-90);end.setUTCDate(end.getUTCDate()+548);addMondays(start.toISOString().slice(0,10),end.toISOString().slice(0,10));
 if(/^\d{4}-\d{2}$/.test(month)&&model.validDate(month+'-01')){const endMonth=new Date(month+'-01T12:00:00Z');endMonth.setUTCMonth(endMonth.getUTCMonth()+1);endMonth.setUTCDate(0);addMondays(month+'-01',endMonth.toISOString().slice(0,10));}
 const custom=(state.customEvents||[]).map(e=>({...e,iso:e.iso||(model.validDate(e.date)?e.date:'2027-03-'+String(e.day).padStart(2,'0'))}));
 const nonTrips=[...seed.filter(e=>e.type!=='Club night'),...dates.values(),...custom].filter(e=>(!e.committeeOnly&&e.type!=='Committee meeting')||canSeeCommittee);
 const trips=state.trips.filter(t=>t.approvalStatus==='Approved'||model.canManageTrip(t,actor,role)).map(t=>({id:t.id,iso:t.startDate,endIso:t.endDate,date:t.dates,title:t.title,type:'Trip',location:t.location,time:'See trip',description:t.description,mainTrip:true,demo:t.demo}));
 return [...nonTrips,...trips].sort((a,b)=>(a.iso||'').localeCompare(b.iso||'')||(a.time||'').localeCompare(b.time||'')||a.title.localeCompare(b.title));
}
function select(events,{period='Upcoming',kind='All events',query='',today=planning.today()}={}){
 return events.filter(e=>period==='Past'?(e.endIso||e.iso)<today:(e.endIso||e.iso)>=today).filter(e=>kind==='All events'||(kind==='Trips'?e.type==='Trip':kind==='Weekly meets'?e.type==='Club night':kind==='Meetings'?['AGM','Committee meeting'].includes(e.type):kind==='Socials'?e.type==='Social':e.type==='Course')).filter(e=>[e.title,e.location,e.type].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
}
module.exports={build,select};
