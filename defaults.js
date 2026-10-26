const initialRoleAssignments={
  'Stephen Wilmot':['Chair','Club Administrator'], 'Alice Denning':['Vice Chair','Club Administrator'], 'Alasdair McGregor':['Secretary','Club Administrator'],
  'Lukas Koch':['Treasurer'], 'Miran Bray':['Marketing & Member Engagement Lead'],
  'Lewis Small':['Digital & Brand Lead'], 'Eddie Shaw':['Membership Secretary'],
  'Stu Block':['Trip Organiser','Club Administrator'], 'Colin Glenny':['Trip Organiser'],
  'Tom Harriot':['Safeguarding Officer'], 'Matt Barnes-Smith':['Social & Culture Secretary'],
};
const initialMemberRecords=[
  {id:1,name:'Stu Block',number:'BCC-2026-014',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:2,name:'Stephen Wilmot',number:'BCC-2024-003',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:3,name:'Alice Denning',number:'BCC-2024-011',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:4,name:'Maya Collins',number:'BCC-TRIAL-028',type:'Trial',status:'Active',expiry:'',trialEnd:'30 April 2027'},
  {id:5,name:'Eddie Shaw',number:'BCC-2025-019',type:'Full',status:'Expired',expiry:'31 August 2026',trialEnd:''},
  {id:6,name:'Alasdair McGregor',number:'BCC-2024-006',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:7,name:'Lukas Koch',number:'BCC-2024-009',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:8,name:'Miran Bray',number:'BCC-2025-004',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:9,name:'Lewis Small',number:'BCC-2025-008',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:10,name:'Colin Glenny',number:'BCC-2025-021',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:11,name:'Tom Harriot',number:'BCC-2024-017',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
  {id:12,name:'Matt Barnes-Smith',number:'BCC-2025-025',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''},
];
const initialApplications=[
  {id:101,name:'Jordan Lee',submitted:'Today',experience:'Indoor climber - 2 years',paid:true,whatsApp:false,bmcUpdated:false,bmcNumber:'',contactMade:true,welcomeRequested:true},
  {id:102,name:'Sam Patel',submitted:'Yesterday',experience:'Trad and sport - 5 years',paid:true,whatsApp:true,bmcUpdated:false,bmcNumber:'',contactMade:false,welcomeRequested:false},
  {id:103,name:'Casey Brown',submitted:'3 days ago',experience:'New climber',paid:false,whatsApp:false,bmcUpdated:false,bmcNumber:'',contactMade:true,welcomeRequested:true},
];
const initialMemberProfiles={
  'Stu Block': {tradLevel:'Independent leader',tradLead:'VS 4c',tradSecond:'HVS 5a',sportLevel:'Independent leader',sportLead:'6a',sportTopRope:'6b',boulderLevel:'Indoor and outdoor',boulderIndoor:'V4',boulderOutdoor:'V3',experience:['Multi-pitch','Abseiling','Scrambling']},
  'Alice Denning': {tradLevel:'Seconding',tradLead:'Not leading',tradSecond:'VS 4c',sportLevel:'Independent leader',sportLead:'6a+',sportTopRope:'6b',boulderLevel:'Indoor',boulderIndoor:'V3',boulderOutdoor:'Not recorded',experience:['Abseiling']},
  'Alasdair McGregor': {tradLevel:'Experienced leader',tradLead:'HVS 5a',tradSecond:'E1 5b',sportLevel:'Independent leader',sportLead:'6b',sportTopRope:'6b+',boulderLevel:'Occasional',boulderIndoor:'V3',boulderOutdoor:'V2',experience:['Multi-pitch','Abseiling','Scrambling','Navigation']},
  'Lewis Small': {tradLevel:'Learning to lead',tradLead:'Diff',tradSecond:'Severe',sportLevel:'Independent leader',sportLead:'6a',sportTopRope:'6b',boulderLevel:'Indoor and outdoor',boulderIndoor:'V5',boulderOutdoor:'V4',experience:['Abseiling']},
  'Tom Harriot': {tradLevel:'Independent leader',tradLead:'VS 4c',tradSecond:'HVS 5a',sportLevel:'Independent leader',sportLead:'6b',sportTopRope:'6c',boulderLevel:'Indoor',boulderIndoor:'V4',boulderOutdoor:'Not recorded',experience:['Multi-pitch','Abseiling']},
  'Miran Bray': {tradLevel:'Seconding',tradLead:'Not leading',tradSecond:'Severe',sportLevel:'Learning to lead',sportLead:'5+',sportTopRope:'6a',boulderLevel:'Indoor',boulderIndoor:'V2',boulderOutdoor:'Not recorded',experience:[]},
  'Eddie Shaw': {tradLevel:'New to trad',tradLead:'Not leading',tradSecond:'Diff',sportLevel:'Top-rope climber',sportLead:'Not leading',sportTopRope:'5+',boulderLevel:'Indoor',boulderIndoor:'V2',boulderOutdoor:'Not recorded',experience:[]},
};
const initialProfileSettings={
  directoryVisible:true, photoVisibleToMembers:true, gradesVisible:true,
  contactable:true, showPartnerStatus:true,
  imageConsentApp:true, imageConsentWebsite:false, imageConsentSocial:false,
};
const initialPartnerRequests=[
  {id:401,name:'Miran Bray',where:'High Sports Brighton',when:'Tuesday 22 September, 19:00',types:['Sport','Indoor'],details:'Looking for a regular lead-climbing partner. Happy to top-rope as well.',flexible:true,expires:'23 September'},
  {id:402,name:'Eddie Shaw',where:'Harrison\'s Rocks',when:'Saturday 26 September, morning',types:['Trad'],details:'Would like to second and gain more outdoor experience.',flexible:false,expires:'27 September'},
  {id:403,name:'Lewis Small',where:'The Project, Shoreham',when:'Thursday evening',types:['Bouldering','Indoor'],details:'Social bouldering session. Any grade welcome.',flexible:true,expires:'Friday'},
];
const initialCourses=[
  {id:201,title:'Abseiling course',provider:'Hatt Adventures',email:'courses@thehatt.co.uk',date:'27 September 2026',time:'09:30-16:00',location:'Harrison\'s Rocks',price:'GBP 45',deadline:'20 September 2026',description:'A practical introduction to abseiling systems, equipment and safe technique.',status:'Approved'},
  {id:202,title:'Outdoor lead climbing workshop',provider:'High Sports Brighton',email:'courses@high-sports.co.uk',date:'18 October 2026',time:'10:00-15:30',location:'Southern Sandstone',price:'GBP 55',deadline:'11 October 2026',description:'A coached day covering outdoor lead-climbing judgement, communication and movement.',status:'Pending'},
];
initialMemberRecords.push({id:99,name:'Jordan Lee',number:'BCC-DEMO-099',type:'Full',status:'Active',expiry:'31 December 2026',trialEnd:''});
const initialNews=[{id:301,type:'TRIP REPORT',title:'Peak District weekend',body:'Great routes, plenty of teamwork and a very sociable evening in Hathersage.',notify:true,status:'Approved',reportUrl:'https://drive.google.com'},{id:302,type:'CLUB NEWS',title:'2027 trip planning',body:'Voting is now open for next year destinations and climbing styles.',notify:false,status:'Approved',reportUrl:''}];
module.exports={initialRoleAssignments,initialMemberRecords,initialApplications,initialMemberProfiles,initialProfileSettings,initialPartnerRequests,initialCourses,initialNews};
