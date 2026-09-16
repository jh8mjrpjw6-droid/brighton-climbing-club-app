import React, { useState } from 'react';
import {
  Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.maxFontSizeMultiplier = 1.15;

const C = { navy:'#10243E', blue:'#1769E0', green:'#147A45', red:'#B43B3B', bg:'#F4F6F8', grey:'#687588', white:'#FFFFFF' };

const EVENTS = [
  {id:1,type:'Trip',date:'28 MAR',title:'Portland climbing weekend',location:'Portland, Dorset',time:'09:00',going:12,capacity:16,styles:'Trad & Sport',level:'Independent climbers; newer outdoor climbers supported',description:'A sociable weekend on Portland limestone, with groups organised around experience and climbing preference.',stay:'Bunkhouse and camping options',organiser:'Stu B'},
  {id:2,type:'Meet',date:'02 APR',title:'Friday indoor social',location:'High Sports Brighton',time:'18:30',going:18,capacity:30,styles:'Indoor climbing',level:'Everyone welcome',description:'Our regular club climbing session followed by an optional drink nearby.',stay:'Not applicable',organiser:'Meets Team'},
  {id:3,type:'Course',date:'11 APR',title:'Outdoor skills refresher',location:'Harrisons Rocks',time:'10:00',going:8,capacity:10,styles:'Trad skills',level:'Members moving outdoors',description:'A practical refresher covering anchors, communication, guidebooks and crag etiquette.',stay:'Day event',organiser:'Training Team'},
  {id:4,type:'Social',date:'18 APR',title:'BCC spring social',location:'The Walrus, Brighton',time:'19:00',going:22,capacity:40,styles:'Social',level:'All members',description:'An informal evening for new and existing members to meet the committee and one another.',stay:'Not applicable',organiser:'Social Team'},
  {id:5,type:'Trip',date:'01 MAY',title:'Cornwall bank holiday',location:'West Cornwall',time:'08:30',going:14,capacity:18,styles:'Trad, Sport & Bouldering',level:'Mixed experience groups',description:'Three days of sea-cliff trad, sport and bouldering, with wet-weather alternatives.',stay:'Campsite and bunkhouse',organiser:'Trips Team'},
  {id:6,type:'Meet',date:'06 MAY',title:'New member welcome climb',location:'High Sports Brighton',time:'18:30',going:9,capacity:20,styles:'Indoor climbing',level:'New members',description:'Meet the club, find regular partners and learn how BCC trips and events work.',stay:'Not applicable',organiser:'Membership Team'},
];

const MEMBERS = [
  {name:'Alex Morgan',initials:'AM',level:'Trad leader - Sport - Indoor',area:'Brighton',available:'Weekends'},
  {name:'Priya Shah',initials:'PS',level:'Sport - Bouldering',area:'Hove',available:'Evenings'},
  {name:'Tom Richards',initials:'TR',level:'Trad - Multipitch',area:'Worthing',available:'Weekends'},
  {name:'Maya Collins',initials:'MC',level:'Indoor - Learning outdoors',area:'Lewes',available:'Flexible'},
];

const PARTNERS = [
  {name:'Priya',when:'Thursday evening',where:'High Sports',detail:'Looking for a regular lead-belaying partner. Happy climbing 6a-6c.'},
  {name:'Tom',when:'Sunday',where:'Harrisons Rocks',detail:'Weather permitting. Trad mileage around Severe-HVS.'},
  {name:'Maya',when:'Next week',where:'Brighton',detail:'New member looking for an indoor partner and outdoor skills practice.'},
];

const INITIAL_APPLICATIONS = [
  {id:1,name:'Jordan Lee',submitted:'Today',experience:'Indoor climber - 2 years'},
  {id:2,name:'Sam Patel',submitted:'Yesterday',experience:'Trad and sport - 5 years'},
  {id:3,name:'Casey Brown',submitted:'3 days ago',experience:'New climber'},
];

const INITIAL_TRIP_REQUESTS = [
  {id:1,eventId:1,name:'Alex Morgan',grade:'HVS / 6a',partner:'No - looking for one',social:'Yes',status:'Pending'},
  {id:2,eventId:1,name:'Priya Shah',grade:'6b sport',partner:'Yes',social:'Maybe',status:'Pending'},
  {id:3,eventId:1,name:'Maya Collins',grade:'Indoor 6a',partner:'No',social:'Yes',status:'Waiting list'},
];

const INITIAL_MEMBER_RECORDS = [
  {id:1,name:'Stu B',type:'Full',expiry:'31 Dec 2026',role:'Admin'},
  {id:2,name:'Alex Morgan',type:'Full',expiry:'31 Dec 2026',role:'Committee'},
  {id:3,name:'Priya Shah',type:'Full',expiry:'30 Jun 2027',role:'Trip Organiser'},
  {id:4,name:'Maya Collins',type:'Trial',expiry:'30 Apr 2027',role:'Trial Member'},
];

export default function App() {
  const [entered,setEntered] = useState(false);
  const [tab,setTab] = useState('home');
  const [screen,setScreen] = useState(null);
  const [selected,setSelected] = useState(null);
  const [joined] = useState([2]);
  const [applications,setApplications] = useState(INITIAL_APPLICATIONS);
  const [role,setRole] = useState('Admin');
  const [tripRequests,setTripRequests] = useState(INITIAL_TRIP_REQUESTS);
  const [memberRecords,setMemberRecords] = useState(INITIAL_MEMBER_RECORDS);
  const [membershipApproved] = useState(true);

  const openEvent = event => { setSelected(event); setScreen('event'); };
  const back = () => { setScreen(null); setSelected(null); };
  const myRequest = selected ? tripRequests.find(r=>r.eventId===selected.id&&r.name==='Stu B') : null;

  if(!entered) return <SafeAreaView style={s.safe}><StatusBar barStyle="light-content"/><Welcome enter={()=>setEntered(true)}/></SafeAreaView>;

  let content;
  if(screen==='event') content=<EventDetail event={selected} joined={joined.includes(selected.id)} approved={membershipApproved} request={myRequest} apply={()=>setScreen('tripForm')} back={back}/>;
  else if(screen==='tripForm') content=<TripForm event={selected} requests={tripRequests} setRequests={setTripRequests} done={()=>setScreen('event')} back={()=>setScreen('event')}/>;
  else if(screen==='profile') content=<Profile back={back}/>;
  else if(screen==='admin') content=<Admin applications={applications} setApplications={setApplications} back={back}/>;
  else if(screen==='tripAdmin') content=<TripAdmin requests={tripRequests} setRequests={setTripRequests} back={back}/>;
  else if(screen==='roles') content=<RoleAdmin records={memberRecords} setRecords={setMemberRecords} back={back}/>;
  else if(screen==='memberAdmin') content=<MemberAdmin records={memberRecords} setRecords={setMemberRecords} back={back}/>;
  else if(screen==='safeguarding') content=<Safeguarding back={back}/>;
  else if(screen==='membership') content=<Membership type={role==='Trial Member'?'Trial':'Full'} expiry={role==='Trial Member'?'30 Apr 2027':'31 Dec 2026'} back={back}/>;
  else if(tab==='home') content=<Home events={EVENTS} joined={joined} openEvent={openEvent} go={setTab}/>;
  else if(tab==='calendar') content=<Calendar events={EVENTS} joined={joined} openEvent={openEvent}/>;
  else if(tab==='members') content=<Members/>;
  else content=<More role={role} setRole={setRole} open={setScreen} pending={applications.length} tripPending={tripRequests.filter(r=>r.status==='Pending').length}/>;

  return <SafeAreaView style={s.safe}><StatusBar barStyle="light-content"/>{content}{!screen&&<Bottom tab={tab} setTab={setTab}/>}</SafeAreaView>;
}

function Header({title='Brighton Climbing Club',subtitle='Welcome back, Stu',back}){
  return <View style={s.header}>
    {back ? <TouchableOpacity style={s.back} onPress={back}><Text style={s.backText}>BACK</Text></TouchableOpacity> : <View style={s.logo}><Text style={s.logoText}>BCC</Text></View>}
    <View style={s.grow}><Text style={s.headerTitle}>{title}</Text><Text style={s.headerSub}>{subtitle}</Text></View>
    {!back&&<View style={s.avatar}><Text style={s.whiteBold}>SB</Text></View>}
  </View>;
}

function Page({children}){return <ScrollView style={s.page} contentContainerStyle={s.content}>{children}</ScrollView>}

function Welcome({enter}){
  return <View style={s.welcomePage}><Image source={require('./assets/icon.png')} style={s.welcomeLogo}/><Text style={s.welcomeTitle}>Brighton Climbing Club</Text><Text style={s.welcomeLead}>Climb together. Learn together. Explore more.</Text><View style={s.welcomeCard}><Text style={s.welcomeCardTitle}>Join the club</Text><Text style={s.welcomeCopy}>The finished app will let new members apply here, add their climbing grades and belay status, and choose photo permissions before the Membership Secretary approves their account.</Text><View style={s.demoBanner}><Text style={s.demoBannerTitle}>TESTFLIGHT DEMONSTRATOR</Text><Text style={s.demoBannerCopy}>No registration is needed for this test. Everyone enters as an approved member with Admin access so every feature can be explored.</Text></View><TouchableOpacity style={s.primary} onPress={enter}><Text style={s.buttonText}>Enter the BCC demonstrator</Text></TouchableOpacity></View><Text style={s.welcomeFine}>Sample information only - no personal data is collected</Text></View>;
}

function Home({events,joined,openEvent,go}){
  const next=events[0];
  return <><Header/><Page>
    <View style={s.memberCard}><View style={s.grow}><Text style={s.label}>MEMBERSHIP</Text><Text style={s.big}>Active member</Text><Text style={s.muted}>Valid until 31 December 2026</Text></View><Badge text="ACTIVE" green/></View>
    <Text style={s.section}>Coming up</Text><EventCard event={next} joined={joined.includes(next.id)} press={()=>openEvent(next)}/>
    <View style={s.grid}><Quick icon="CAL" title="Events" copy="Trips, meets and socials" press={()=>go('calendar')}/><Quick icon="CLIMB" title="Find a partner" copy="Arrange a climb" press={()=>go('members')}/></View>
    <Text style={s.section}>Club update</Text><View style={s.notice}><Text style={s.noticeLabel}>2027 PLANNING</Text><Text style={s.noticeTitle}>Help shape next years trips</Text><Text style={s.noticeCopy}>Vote for destinations, climbing styles and development weekends.</Text><Text style={s.whiteBold}>Open member poll ></Text></View>
    <View style={s.stats}><Stat number="86" label="Members"/><Stat number="14" label="Events"/><Stat number="6" label="Trips"/></View>
  </Page></>;
}

function Calendar({events,joined,openEvent}){
  const [filter,setFilter]=useState('All');
  const filters=['All','Trip','Meet','Course','Social'];
  const shown=filter==='All'?events:events.filter(e=>e.type===filter);
  return <><Header title="Events" subtitle="Trips, meets, courses and socials"/><Page>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll}>{filters.map(f=><TouchableOpacity key={f} style={[s.chip,filter===f&&s.chipOn]} onPress={()=>setFilter(f)}><Text style={filter===f?s.chipTextOn:s.chipText}>{f}</Text></TouchableOpacity>)}</ScrollView>
    <Text style={s.resultText}>{shown.length} upcoming {shown.length===1?'event':'events'}</Text>
    {shown.map(e=><EventCard key={e.id} event={e} joined={joined.includes(e.id)} press={()=>openEvent(e)}/>) }
  </Page></>;
}

function EventCard({event,joined,press}){
  const [day,mon]=event.date.split(' ');
  return <TouchableOpacity style={s.eventCard} onPress={press}><View style={s.date}><Text style={s.dateMonth}>{mon}</Text><Text style={s.dateDay}>{day}</Text></View><View style={s.grow}><View style={s.rowBetween}><Text style={s.blueLabel}>{event.type.toUpperCase()} - {event.styles.toUpperCase()}</Text>{joined&&<Badge text="GOING" green/>}</View><Text style={s.eventTitle}>{event.title}</Text><Text style={s.muted}>{event.location} - {event.time}</Text><Text style={s.greenText}>{event.going} attending - {event.capacity-event.going} places remaining</Text></View></TouchableOpacity>;
}

function EventDetail({event,joined,approved,request,apply,back}){
  return <><Header title="Event details" subtitle={event.type} back={back}/><Page>
    <EventCard event={event} joined={joined} press={()=>{}}/>
    {joined&&<View style={s.confirm}><Text style={s.tick}>OK</Text><View><Text style={s.confirmTitle}>Youre attending</Text><Text style={s.muted}>Your place is reserved.</Text></View></View>}
    <Text style={s.section}>About this event</Text><Text style={s.body}>{event.description}</Text>
    <Fact icon="GROUP" title="Who its for" copy={event.level}/><Fact icon="CLIMB" title="Climbing" copy={event.styles}/><Fact icon="PIN" title="Meeting" copy={`${event.location} at ${event.time}`}/><Fact icon="STAY" title="Accommodation" copy={event.stay}/><Fact icon="ORG" title="Organiser" copy={event.organiser}/>
    <View style={s.warning}><Text style={s.warningTitle}>Before joining</Text><Text style={s.warningCopy}>Check that your profile and emergency-contact details are current.</Text></View>
    {!approved&&<View style={s.warning}><Text style={s.warningTitle}>Membership approval required</Text><Text style={s.warningCopy}>You can browse events while your application is pending, but you cannot request a trip place until an Admin or Committee member approves your membership.</Text></View>}
    {request&&<View style={s.confirm}><Text style={s.tick}>?</Text><View><Text style={s.confirmTitle}>Request {request.status}</Text><Text style={s.muted}>The trip organiser will review your answers.</Text></View></View>}
    {approved&&!joined&&!request&&<TouchableOpacity style={s.primary} onPress={apply}><Text style={s.buttonText}>Request a place</Text></TouchableOpacity>}
    {joined&&<TouchableOpacity style={[s.primary,s.danger]} onPress={()=>Alert.alert('Withdraw','The organiser would be notified of your withdrawal.')}><Text style={s.buttonText}>Withdraw from event</Text></TouchableOpacity>}
    <TouchableOpacity style={s.secondary} onPress={back}><Text style={s.secondaryText}>Back to events</Text></TouchableOpacity>
  </Page></>;
}

function Members(){
  const [view,setView]=useState('directory');
  return <><Header title="Club community" subtitle="Members and climbing partners"/><Page>
    <View style={s.segment}><TouchableOpacity style={[s.segmentButton,view==='directory'&&s.segmentOn]} onPress={()=>setView('directory')}><Text style={view==='directory'?s.segmentTextOn:s.segmentText}>Members</Text></TouchableOpacity><TouchableOpacity style={[s.segmentButton,view==='partners'&&s.segmentOn]} onPress={()=>setView('partners')}><Text style={view==='partners'?s.segmentTextOn:s.segmentText}>Partner board</Text></TouchableOpacity></View>
    {view==='directory'?<><TextInput style={s.search} placeholder="Search members" placeholderTextColor={C.grey}/>{MEMBERS.map(m=><View style={s.person} key={m.name}><View style={s.personAvatar}><Text style={s.avatarText}>{m.initials}</Text></View><View style={s.grow}><Text style={s.personName}>{m.name}</Text><Text style={s.muted}>{m.level}</Text><Text style={s.smallBlue}>{m.area} - {m.available}</Text></View><Text style={s.chevron}>></Text></View>)}</>:<><TouchableOpacity style={s.primary} onPress={()=>Alert.alert('Demo','A real member would create a partner request here.')}><Text style={s.buttonText}>+ Post a partner request</Text></TouchableOpacity>{PARTNERS.map(p=><View style={s.partner} key={p.name}><View style={s.rowBetween}><Text style={s.personName}>{p.name}</Text><Badge text={p.when}/></View><Text style={s.smallBlue}>PIN {p.where}</Text><Text style={s.bodySmall}>{p.detail}</Text><TouchableOpacity style={s.message} onPress={()=>Alert.alert('Message sent',`A private conversation with ${p.name} would open.`)}><Text style={s.messageText}>Message {p.name}</Text></TouchableOpacity></View>)}</>}
  </Page></>;
}

function More({role,setRole,open,pending,tripPending}){
  const canCommittee=role==='Admin'||role==='Committee';
  const canTrips=canCommittee||role==='Trip Organiser';
  return <><Header title="More" subtitle="Your membership and club services"/><Page>
    <TouchableOpacity style={s.profileTop} onPress={()=>open('profile')}><View style={s.profileAvatar}><Text style={s.profileInitials}>SB</Text></View><View style={s.grow}><Text style={s.big}>Stu B</Text><Text style={s.muted}>Active member - Brighton</Text></View><Text style={s.chevron}>></Text></TouchableOpacity>
    <Text style={s.menuLabel}>MEMBERSHIP</Text><Menu icon="CARD" title="Digital membership card" copy="View membership and renewal" press={()=>open('membership')}/><Menu icon="CLIMB" title="My climbing profile" copy="Experience, interests and availability" press={()=>open('profile')}/><Menu icon="NOTE" title="Notifications" copy="Trips, reminders and announcements" press={()=>Alert.alert('Notifications','All important BCC notifications are enabled.')}/>
    <Text style={s.menuLabel}>CLUB SUPPORT</Text><Menu icon="SAFE" title="Safeguarding contact" copy="Private message to the safeguarding team" press={()=>open('safeguarding')}/><Menu icon="DOC" title="Club documents" copy="Policies, constitution and trip guidance" press={()=>Alert.alert('Club documents','Documents would open securely here.')}/>
    <Text style={s.menuLabel}>DEMONSTRATE AS</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{['Admin','Committee','Trip Organiser','Member','Trial Member'].map(r=><TouchableOpacity key={r} style={[s.chip,role===r&&s.chipOn]} onPress={()=>setRole(r)}><Text style={role===r?s.chipTextOn:s.chipText}>{r}</Text></TouchableOpacity>)}</ScrollView><Text style={s.muted}>Current access: {role}</Text>
    {canTrips&&<><Text style={s.menuLabel}>TRIP ORGANISER</Text><Menu icon="TRIP" title="Trip requests" copy={`${tripPending} requests awaiting a decision`} press={()=>open('tripAdmin')}/></>}
    {canCommittee&&<><Text style={s.menuLabel}>COMMITTEE</Text><Menu icon="OK" title="Membership approvals" copy={`${pending} applications awaiting review`} press={()=>open('admin')}/><Menu icon="MEM" title="Membership types and expiry" copy="Set Trial or Full membership and expiry dates" press={()=>open('memberAdmin')}/><Menu icon="ADD" title="Create an event" copy="Trips, courses, meets and socials" press={()=>Alert.alert('Create event','The committee event form would open here.')}/><Menu icon="NEWS" title="Send an announcement" copy="Notify all members or selected groups" press={()=>Alert.alert('Announcement','Audience and message controls would open here.')}/></>}
    {role==='Admin'&&<><Text style={s.menuLabel}>ADMIN ONLY</Text><Menu icon="ROLE" title="Assign committee roles" copy="Allocate Admin, Committee and Trip Organiser access" press={()=>open('roles')}/></>}
    <Text style={s.version}>BCC demonstrator - Sample information only</Text>
  </Page></>;
}

function Profile({back}){
  const [available,setAvailable]=useState(true);
  const [tradGrade,setTradGrade]=useState('HVS');
  const [sportGrade,setSportGrade]=useState('6a');
  const [indoorGrade,setIndoorGrade]=useState('6b');
  const [topRopeBelay,setTopRopeBelay]=useState(true);
  const [leadBelay,setLeadBelay]=useState(true);
  const [photoMembers,setPhotoMembers]=useState(true);
  const [photoWebsite,setPhotoWebsite]=useState(true);
  const [photoSocial,setPhotoSocial]=useState(false);
  return <><Header title="My profile" subtitle="Member information" back={back}/><Page><View style={s.profileHero}><View style={s.profileAvatar}><Text style={s.profileInitials}>SB</Text></View><Text style={s.big}>Stu B</Text><Text style={s.muted}>Active member since January 2026</Text></View><Text style={s.menuLabel}>CLIMBING PROFILE</Text><Fact icon="CLIMB" title="Interests" copy="Trad, sport, bouldering and multipitch"/><Fact icon="PIN" title="Home area" copy="Brighton & Hove"/><Text style={s.menuLabel}>BEST COMFORTABLE GRADES</Text><ProfileInput label="TRAD" value={tradGrade} setValue={setTradGrade} placeholder="Example: HVS"/><ProfileInput label="SPORT" value={sportGrade} setValue={setSportGrade} placeholder="Example: 6a"/><ProfileInput label="INDOOR" value={indoorGrade} setValue={setIndoorGrade} placeholder="Example: 6b"/><Text style={s.menuLabel}>BELAY SIGN-OFF</Text><TickRow title="Top-rope belaying" copy="Club sign-off recorded" value={topRopeBelay} setValue={setTopRopeBelay}/><TickRow title="Lead belaying" copy="Club sign-off recorded" value={leadBelay} setValue={setLeadBelay}/><View style={s.warning}><Text style={s.warningTitle}>Verification</Text><Text style={s.warningCopy}>In the live app, belay sign-off will be confirmed by an authorised club person and will record who verified it and when.</Text></View><Text style={s.menuLabel}>PHOTO PERMISSIONS</Text><Text style={s.bodySmall}>Choose each use separately. Consent can be changed or withdrawn at any time.</Text><TickRow title="Private member communications" copy="Trip albums and member-only updates" value={photoMembers} setValue={setPhotoMembers}/><TickRow title="BCC website and newsletters" copy="Club publicity and reports" value={photoWebsite} setValue={setPhotoWebsite}/><TickRow title="Public social media" copy="BCC social channels" value={photoSocial} setValue={setPhotoSocial}/><Text style={s.menuLabel}>PARTNER REQUESTS</Text><View style={s.roleCard}><View style={s.grow}><Text style={s.personName}>Available for partner requests</Text><Text style={s.muted}>Allow members to contact you through the app.</Text></View><TouchableOpacity style={[s.switch,available&&s.switchOn]} onPress={()=>setAvailable(!available)}><View style={[s.switchDot,available&&s.switchDotOn]}/></TouchableOpacity></View><Text style={s.menuLabel}>PRIVATE INFORMATION</Text><Fact icon="TEL" title="Emergency contact" copy="Stored securely - Visible only when required"/><Fact icon="MED" title="Relevant medical information" copy="Up to date - Committee access restricted"/><TouchableOpacity style={s.primary} onPress={()=>Alert.alert('Demonstration','The live app will save these choices securely to the member record.')}><Text style={s.buttonText}>Save profile</Text></TouchableOpacity></Page></>;
}

function ProfileInput({label,value,setValue,placeholder}){return <View style={s.profileInputRow}><Text style={s.profileInputLabel}>{label}</Text><TextInput style={s.profileInput} value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor={C.grey}/></View>}

function TickRow({title,copy,value,setValue}){return <TouchableOpacity style={s.tickRow} onPress={()=>setValue(!value)}><View style={[s.checkBox,value&&s.checkBoxOn]}><Text style={s.checkMark}>{value?'OK':''}</Text></View><View style={s.grow}><Text style={s.personName}>{title}</Text><Text style={s.muted}>{copy}</Text></View></TouchableOpacity>}

function Admin({applications,setApplications,back}){
  const approve=id=>setApplications(old=>old.filter(a=>a.id!==id));
  return <><Header title="Membership approvals" subtitle="Committee access" back={back}/><Page><View style={s.adminSummary}><Text style={s.summaryNumber}>{applications.length}</Text><View><Text style={s.personName}>Applications awaiting review</Text><Text style={s.muted}>Demonstration data only</Text></View></View>{applications.length===0?<View style={s.empty}><Text style={s.emptyIcon}>OK</Text><Text style={s.big}>All caught up</Text><Text style={s.muted}>There are no applications waiting.</Text></View>:applications.map(a=><View style={s.application} key={a.id}><View style={s.rowBetween}><Text style={s.personName}>{a.name}</Text><Badge text={a.submitted}/></View><Text style={s.muted}>{a.experience}</Text><View style={s.actionRow}><TouchableOpacity style={s.review} onPress={()=>Alert.alert(a.name,'The full membership application would open here.')}><Text style={s.reviewText}>Review</Text></TouchableOpacity><TouchableOpacity style={s.approve} onPress={()=>approve(a.id)}><Text style={s.approveText}>Approve</Text></TouchableOpacity></View></View>)}</Page></>;
}

function Safeguarding({back}){
  const [message,setMessage]=useState('');
  return <><Header title="Safeguarding" subtitle="Private and confidential" back={back}/><Page><View style={s.safeguardIntro}><Text style={s.safeguardIcon}>SAFE</Text><Text style={s.big}>Contact the safeguarding team</Text><Text style={s.body}>Messages sent here are restricted to authorised safeguarding officers and do not enter general committee communications.</Text></View><Text style={s.inputLabel}>YOUR MESSAGE</Text><TextInput style={s.messageInput} multiline value={message} onChangeText={setMessage} placeholder="Explain how the safeguarding team can help..." placeholderTextColor={C.grey}/><TouchableOpacity style={[s.primary,!message&&s.disabled]} disabled={!message} onPress={()=>{Alert.alert('Demonstration','The message would now be sent securely.');setMessage('')}}><Text style={s.buttonText}>Send private message</Text></TouchableOpacity><View style={s.warning}><Text style={s.warningTitle}>Immediate danger</Text><Text style={s.warningCopy}>This inbox is not monitored as an emergency service. Call 999 where somebody is in immediate danger.</Text></View></Page></>;
}

function TripForm({event,requests,setRequests,done,back}){
  const [grade,setGrade]=useState(''); const [partner,setPartner]=useState(''); const [social,setSocial]=useState('');
  const submit=()=>{setRequests([...requests,{id:Date.now(),eventId:event.id,name:'Stu B',grade,partner,social,status:'Pending'}]);done()};
  const ready=grade&&partner&&social;
  return <><Header title="Request a place" subtitle={event.title} back={back}/><Page><Text style={s.inputLabel}>BEST COMFORTABLE CLIMBING GRADE</Text><TextInput style={s.search} value={grade} onChangeText={setGrade} placeholder="Example: HVS trad, 6a sport" placeholderTextColor={C.grey}/><Choice title="DO YOU ALREADY HAVE A PARTNER?" value={partner} set={setPartner} options={['Yes','No - find me one','Not sure']}/><Choice title="JOIN THE TRIP SOCIAL?" value={social} set={setSocial} options={['Yes','No','Maybe']}/><View style={s.warning}><Text style={s.warningTitle}>Organiser approval</Text><Text style={s.warningCopy}>Submitting this form requests a place. The assigned trip organiser can approve, decline or place you on the waiting list.</Text></View><TouchableOpacity disabled={!ready} style={[s.primary,!ready&&s.disabled]} onPress={submit}><Text style={s.buttonText}>Send request</Text></TouchableOpacity></Page></>;
}

function Choice({title,value,set,options}){return <View><Text style={s.inputLabel}>{title}</Text>{options.map(o=><TouchableOpacity key={o} style={[s.choice,value===o&&s.choiceOn]} onPress={()=>set(o)}><Text style={value===o?s.choiceTextOn:s.choiceText}>{o}</Text></TouchableOpacity>)}</View>}

function TripAdmin({requests,setRequests,back}){
  const update=(id,status)=>setRequests(requests.map(r=>r.id===id?{...r,status}:r));
  return <><Header title="Trip requests" subtitle="Assigned trips only" back={back}/><Page><Text style={s.section}>Portland climbing weekend</Text>{requests.map(r=><View style={s.application} key={r.id}><View style={s.rowBetween}><Text style={s.personName}>{r.name}</Text><Badge text={r.status}/></View><Text style={s.muted}>Grade: {r.grade}</Text><Text style={s.muted}>Partner: {r.partner}</Text><Text style={s.muted}>Social: {r.social}</Text><View style={s.actionRow}><TouchableOpacity style={s.review} onPress={()=>update(r.id,'Waiting list')}><Text style={s.reviewText}>Waitlist</Text></TouchableOpacity><TouchableOpacity style={s.approve} onPress={()=>update(r.id,'Approved')}><Text style={s.approveText}>Approve</Text></TouchableOpacity></View></View>)}</Page></>;
}

function RoleAdmin({records,setRecords,back}){
  const roles=['Member','Trial Member','Trip Organiser','Committee','Admin'];
  const cycle=id=>setRecords(records.map(r=>{if(r.id!==id)return r;const i=roles.indexOf(r.role);return {...r,role:roles[(i+1)%roles.length]}}));
  return <><Header title="Assign roles" subtitle="Admin only" back={back}/><Page><View style={s.warning}><Text style={s.warningTitle}>Role security</Text><Text style={s.warningCopy}>Trip Organiser access should normally be assigned to specific trips. Admin access should be kept to the smallest practical number.</Text></View>{records.map(r=><View style={s.person} key={r.id}><View style={s.grow}><Text style={s.personName}>{r.name}</Text><Text style={s.muted}>{r.role}</Text></View><TouchableOpacity style={s.message} onPress={()=>cycle(r.id)}><Text style={s.messageText}>Change role</Text></TouchableOpacity></View>)}</Page></>;
}

function MemberAdmin({records,setRecords,back}){
  const toggleType=id=>setRecords(records.map(r=>r.id===id?{...r,type:r.type==='Full'?'Trial':'Full'}:r));
  const setExpiry=(id,expiry)=>setRecords(records.map(r=>r.id===id?{...r,expiry}:r));
  return <><Header title="Membership records" subtitle="Type and expiry" back={back}/><Page>{records.map(r=><View style={s.application} key={r.id}><View style={s.rowBetween}><Text style={s.personName}>{r.name}</Text><Badge text={r.type}/></View><Text style={s.inputLabel}>EXPIRY DATE</Text><TextInput style={s.expiryInput} value={r.expiry} onChangeText={value=>setExpiry(r.id,value)} placeholder="Example: 31 Dec 2027" placeholderTextColor={C.grey}/><TouchableOpacity style={s.review} onPress={()=>toggleType(r.id)}><Text style={s.reviewText}>Change to {r.type==='Full'?'Trial':'Full'} membership</Text></TouchableOpacity></View>)}</Page></>;
}

function Membership({type,expiry,back}){return <><Header title="Membership card" subtitle="Brighton Climbing Club" back={back}/><Page><View style={s.digitalCard}><View style={s.rowBetween}><View style={s.logoSmall}><Text style={s.logoText}>BCC</Text></View><Text style={s.cardActive}>ACTIVE</Text></View><Text style={s.cardMember}>Stu B</Text><Text style={s.cardNumber}>{type.toUpperCase()} MEMBER - BCC-2026-014</Text><View style={s.cardBottom}><View><Text style={s.cardFine}>VALID UNTIL</Text><Text style={s.cardValue}>{expiry.toUpperCase()}</Text></View><View><Text style={s.cardFine}>MEMBERSHIP</Text><Text style={s.cardValue}>{type.toUpperCase()}</Text></View></View></View><Fact icon="OK" title={`${type} membership`} copy={`Membership is active until ${expiry}.`}/><Fact icon="LOCK" title="Verification" copy="A rotating verification code would prevent screenshots being used as live membership cards."/></Page></>}

function Fact({icon,title,copy}){return <View style={s.fact}><View style={s.factIcon}><Text style={s.icon}>{icon}</Text></View><View style={s.grow}><Text style={s.personName}>{title}</Text><Text style={s.factCopy}>{copy}</Text></View></View>}
function Quick({icon,title,copy,press}){return <TouchableOpacity style={s.quick} onPress={press}><Text style={s.icon}>{icon}</Text><Text style={s.quickTitle}>{title}</Text><Text style={s.muted}>{copy}</Text></TouchableOpacity>}
function Badge({text,green}){return <View style={[s.badge,green&&s.badgeGreen]}><Text style={[s.badgeText,green&&s.badgeTextGreen]}>{text}</Text></View>}
function Stat({number,label}){return <View style={s.stat}><Text style={s.statNumber}>{number}</Text><Text style={s.muted}>{label}</Text></View>}
function Menu({icon,title,copy,press}){return <TouchableOpacity style={s.menu} onPress={press}><View style={s.menuIcon}><Text style={s.icon}>{icon}</Text></View><View style={s.grow}><Text style={s.personName}>{title}</Text><Text style={s.muted}>{copy}</Text></View><Text style={s.chevron}>></Text></TouchableOpacity>}
function Bottom({tab,setTab}){const items=[['home','H','Home'],['calendar','C','Calendar'],['members','M','Members'],['more','...','More']];return <View style={s.tabs}>{items.map(([key,icon,label])=><TouchableOpacity key={key} style={s.tab} onPress={()=>setTab(key)}><Text style={s.tabIcon}>{icon}</Text><Text style={tab===key?s.tabActive:s.tabText}>{label}</Text></TouchableOpacity>)}</View>}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.navy},page:{flex:1,backgroundColor:C.bg,borderTopLeftRadius:24,borderTopRightRadius:24},content:{padding:18,paddingBottom:42},grow:{flex:1},whiteBold:{color:C.white,fontWeight:'900'},
  welcomePage:{flex:1,backgroundColor:C.navy,paddingHorizontal:22,paddingTop:36,paddingBottom:28,alignItems:'center'},welcomeLogo:{width:108,height:108,borderRadius:24},welcomeTitle:{color:C.white,fontSize:30,fontWeight:'900',textAlign:'center',marginTop:18},welcomeLead:{color:'#C9D5E5',fontSize:15,textAlign:'center',marginTop:8,marginBottom:24},welcomeCard:{width:'100%',backgroundColor:C.white,borderRadius:24,padding:22},welcomeCardTitle:{color:C.navy,fontSize:25,fontWeight:'900'},welcomeCopy:{color:C.grey,fontSize:14,lineHeight:21,marginTop:8},demoBanner:{backgroundColor:'#EAF2FF',borderRadius:16,padding:15,marginTop:18},demoBannerTitle:{color:C.blue,fontSize:11,fontWeight:'900'},demoBannerCopy:{color:C.navy,fontSize:13,lineHeight:19,marginTop:5},welcomeFine:{color:'#8FA5BE',fontSize:11,textAlign:'center',marginTop:20},
  header:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:18,paddingTop:12,paddingBottom:18},headerTitle:{color:C.white,fontSize:18,fontWeight:'900'},headerSub:{color:'#C9D5E5',fontSize:12,marginTop:3},logo:{width:48,height:48,borderRadius:24,backgroundColor:C.white,alignItems:'center',justifyContent:'center'},logoSmall:{width:44,height:44,borderRadius:22,backgroundColor:C.white,alignItems:'center',justifyContent:'center'},logoText:{color:C.navy,fontWeight:'900'},avatar:{width:40,height:40,borderRadius:20,backgroundColor:'#28486B',alignItems:'center',justifyContent:'center'},back:{width:44,height:44,borderRadius:22,backgroundColor:'#28486B',alignItems:'center',justifyContent:'center'},backText:{color:C.white,fontSize:34,lineHeight:37},
  memberCard:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderRadius:18,padding:18},label:{color:C.grey,fontSize:11,fontWeight:'900'},big:{color:C.navy,fontSize:20,fontWeight:'900',marginTop:4},muted:{color:C.grey,fontSize:12,marginTop:4},badge:{backgroundColor:'#EAF2FF',borderRadius:10,paddingHorizontal:9,paddingVertical:6,marginLeft:6},badgeGreen:{backgroundColor:'#E6F7EE'},badgeText:{color:C.blue,fontSize:9,fontWeight:'900'},badgeTextGreen:{color:C.green},section:{color:C.navy,fontSize:21,fontWeight:'900',marginTop:24,marginBottom:12},
  eventCard:{flexDirection:'row',backgroundColor:C.white,borderRadius:18,padding:15,marginBottom:12},date:{width:60,height:72,borderRadius:14,backgroundColor:'#EAF2FF',alignItems:'center',justifyContent:'center',marginRight:13},dateMonth:{color:C.blue,fontSize:10,fontWeight:'900'},dateDay:{color:C.navy,fontSize:27,fontWeight:'900'},rowBetween:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},blueLabel:{color:C.blue,fontSize:9,fontWeight:'900',flexShrink:1},eventTitle:{color:C.navy,fontSize:17,fontWeight:'900',marginTop:5},greenText:{color:C.green,fontSize:11,fontWeight:'800',marginTop:7},
  grid:{flexDirection:'row',gap:12,marginTop:6},quick:{flex:1,backgroundColor:C.white,borderRadius:18,padding:16,minHeight:124},icon:{fontSize:22},quickTitle:{color:C.navy,fontSize:16,fontWeight:'900',marginTop:9},notice:{backgroundColor:C.navy,borderRadius:18,padding:18},noticeLabel:{color:'#75AFFF',fontSize:10,fontWeight:'900'},noticeTitle:{color:C.white,fontSize:20,fontWeight:'900',marginTop:7},noticeCopy:{color:'#D8E1EC',fontSize:13,lineHeight:19,marginVertical:8},stats:{flexDirection:'row',gap:10,marginTop:14},stat:{flex:1,backgroundColor:C.white,borderRadius:14,padding:14,alignItems:'center'},statNumber:{color:C.navy,fontSize:21,fontWeight:'900'},
  tabs:{flexDirection:'row',backgroundColor:C.white,paddingTop:9,paddingBottom:8,borderTopWidth:1,borderTopColor:'#E3E7EC'},tab:{flex:1,alignItems:'center'},tabIcon:{color:C.navy,fontSize:20},tabActive:{color:C.blue,fontSize:11,fontWeight:'900'},tabText:{color:C.grey,fontSize:11,fontWeight:'700'},
  chipScroll:{marginHorizontal:-2,marginBottom:12},chip:{backgroundColor:C.white,borderRadius:18,paddingHorizontal:15,paddingVertical:9,marginRight:8},chipOn:{backgroundColor:C.blue},chipText:{color:C.grey,fontSize:12,fontWeight:'800'},chipTextOn:{color:C.white,fontSize:12,fontWeight:'900'},resultText:{color:C.grey,fontSize:12,fontWeight:'800',marginBottom:12},
  confirm:{flexDirection:'row',alignItems:'center',backgroundColor:'#E6F7EE',borderRadius:16,padding:15,marginBottom:8},tick:{width:38,height:38,borderRadius:19,backgroundColor:C.green,color:C.white,textAlign:'center',lineHeight:38,fontSize:20,fontWeight:'900',marginRight:12},confirmTitle:{color:C.green,fontSize:16,fontWeight:'900'},body:{color:'#536174',fontSize:14,lineHeight:21},bodySmall:{color:'#536174',fontSize:13,lineHeight:19,marginTop:8},fact:{flexDirection:'row',backgroundColor:C.white,borderRadius:16,padding:15,marginTop:10},factIcon:{width:40,height:40,borderRadius:12,backgroundColor:'#EAF2FF',alignItems:'center',justifyContent:'center',marginRight:12},factCopy:{color:C.grey,fontSize:12,lineHeight:18,marginTop:3},warning:{backgroundColor:'#FFF6DF',borderRadius:16,padding:16,marginTop:16},warningTitle:{color:'#7A5511',fontSize:15,fontWeight:'900'},warningCopy:{color:'#785F32',fontSize:12,lineHeight:18,marginTop:5},
  primary:{backgroundColor:C.blue,borderRadius:14,alignItems:'center',padding:15,marginTop:13},buttonText:{color:C.white,fontSize:15,fontWeight:'900',textAlign:'center'},danger:{backgroundColor:C.red},secondary:{borderWidth:2,borderColor:'#D6DDE6',borderRadius:14,alignItems:'center',padding:13,marginTop:10},secondaryText:{color:C.navy,fontSize:14,fontWeight:'900'},disabled:{opacity:.45},
  segment:{flexDirection:'row',backgroundColor:'#E4E9EF',borderRadius:14,padding:4,marginBottom:14},segmentButton:{flex:1,alignItems:'center',padding:10,borderRadius:11},segmentOn:{backgroundColor:C.white},segmentText:{color:C.grey,fontSize:12,fontWeight:'800'},segmentTextOn:{color:C.blue,fontSize:12,fontWeight:'900'},search:{backgroundColor:C.white,borderRadius:14,padding:14,color:C.navy,fontSize:14,marginBottom:12},person:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderRadius:16,padding:14,marginBottom:10},personAvatar:{width:44,height:44,borderRadius:22,backgroundColor:C.navy,alignItems:'center',justifyContent:'center',marginRight:12},avatarText:{color:C.white,fontSize:13,fontWeight:'900'},personName:{color:C.navy,fontSize:15,fontWeight:'900'},smallBlue:{color:C.blue,fontSize:11,fontWeight:'700',marginTop:5},chevron:{color:C.grey,fontSize:28,marginLeft:8},
  partner:{backgroundColor:C.white,borderRadius:17,padding:16,marginTop:12},message:{backgroundColor:'#EAF2FF',borderRadius:11,alignItems:'center',padding:10,marginTop:12},messageText:{color:C.blue,fontSize:12,fontWeight:'900'},profileTop:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderRadius:18,padding:16},profileAvatar:{width:58,height:58,borderRadius:29,backgroundColor:C.navy,alignItems:'center',justifyContent:'center',marginRight:13},profileInitials:{color:C.white,fontSize:18,fontWeight:'900'},menuLabel:{color:C.grey,fontSize:11,fontWeight:'900',marginTop:22,marginBottom:9},menu:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,padding:14,borderRadius:15,marginBottom:9},menuIcon:{width:40,height:40,borderRadius:12,backgroundColor:'#EAF2FF',alignItems:'center',justifyContent:'center',marginRight:12},
  roleCard:{flexDirection:'row',alignItems:'center',backgroundColor:'#EAF2FF',borderRadius:16,padding:15,marginTop:18},switch:{width:50,height:30,borderRadius:15,backgroundColor:'#B8C0CA',padding:3},switchOn:{backgroundColor:C.green},switchDot:{width:24,height:24,borderRadius:12,backgroundColor:C.white},switchDotOn:{marginLeft:20},version:{color:C.grey,fontSize:11,textAlign:'center',marginTop:25},profileHero:{alignItems:'center',backgroundColor:C.white,borderRadius:18,padding:22},profileInputRow:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderRadius:15,padding:12,marginBottom:9},profileInputLabel:{color:C.navy,fontSize:13,fontWeight:'900',width:75},profileInput:{flex:1,backgroundColor:C.bg,borderRadius:10,paddingHorizontal:12,paddingVertical:10,color:C.navy,fontSize:14},tickRow:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderRadius:15,padding:14,marginTop:9},checkBox:{width:34,height:34,borderRadius:9,borderWidth:2,borderColor:'#B8C0CA',alignItems:'center',justifyContent:'center',marginRight:12},checkBoxOn:{backgroundColor:C.green,borderColor:C.green},checkMark:{color:C.white,fontSize:10,fontWeight:'900'},
  adminSummary:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:'#EAF2FF',borderRadius:18,padding:18,marginBottom:14},summaryNumber:{color:C.blue,fontSize:34,fontWeight:'900'},application:{backgroundColor:C.white,borderRadius:17,padding:16,marginBottom:11},actionRow:{flexDirection:'row',gap:9,marginTop:13},review:{flex:1,borderWidth:2,borderColor:'#D6DDE6',borderRadius:11,alignItems:'center',padding:10},reviewText:{color:C.navy,fontWeight:'900'},approve:{flex:1,backgroundColor:C.green,borderRadius:11,alignItems:'center',padding:12},approveText:{color:C.white,fontWeight:'900'},empty:{alignItems:'center',backgroundColor:C.white,borderRadius:18,padding:28},emptyIcon:{color:C.white,backgroundColor:C.green,width:50,height:50,borderRadius:25,textAlign:'center',lineHeight:50,fontSize:25,fontWeight:'900',marginBottom:10},
  safeguardIntro:{alignItems:'center',backgroundColor:C.white,borderRadius:18,padding:20},safeguardIcon:{fontSize:38,marginBottom:8},inputLabel:{color:C.grey,fontSize:11,fontWeight:'900',marginTop:20,marginBottom:8},messageInput:{height:150,backgroundColor:C.white,borderRadius:16,padding:15,color:C.navy,fontSize:14,textAlignVertical:'top'},expiryInput:{backgroundColor:C.bg,borderRadius:12,padding:12,color:C.navy,fontSize:14,marginBottom:10},choice:{backgroundColor:C.white,borderRadius:13,padding:13,marginBottom:8,borderWidth:2,borderColor:C.white},choiceOn:{borderColor:C.blue,backgroundColor:'#EAF2FF'},choiceText:{color:C.grey,fontWeight:'800'},choiceTextOn:{color:C.blue,fontWeight:'900'},
  digitalCard:{backgroundColor:C.navy,borderRadius:22,padding:20,minHeight:230,justifyContent:'space-between'},cardActive:{color:'#79E5AA',fontSize:11,fontWeight:'900'},cardMember:{color:C.white,fontSize:28,fontWeight:'900',marginTop:24},cardNumber:{color:'#C9D5E5',fontSize:11,fontWeight:'800',marginTop:4},cardBottom:{flexDirection:'row',justifyContent:'space-between',marginTop:35},cardFine:{color:'#8FA5BE',fontSize:9,fontWeight:'900'},cardValue:{color:C.white,fontSize:13,fontWeight:'900',marginTop:4},
});
