const access=require('./access'),defaults=require('./defaults');
const roleOptions=['Chair','Vice Chair','Secretary','Treasurer','Marketing & Member Engagement Lead','Digital & Brand Lead','Membership Secretary','Trips Committee','Trip Organiser','Safeguarding Officer','Social & Culture Secretary','Committee Member','Digital & Media','Appointed Assessor','Club Administrator'];
function migrate(state){
 const next={...state};
 for(const [key,value]of Object.entries({roleAssignments:defaults.initialRoleAssignments,memberRecords:defaults.initialMemberRecords,applications:defaults.initialApplications,memberProfiles:defaults.initialMemberProfiles,partnerRequests:defaults.initialPartnerRequests,courses:defaults.initialCourses,news:defaults.initialNews}))if(next[key]===undefined)next[key]=JSON.parse(JSON.stringify(value));
 return next;
}
const records=state=>state.memberRecords||defaults.initialMemberRecords;
const memberNames=(state,activeOnly=false)=>records(state).filter(r=>activeOnly?r.status==='Active':['Active','Expired'].includes(r.status)).map(r=>r.name);
const effectiveRoles=(state,actor)=>{const result=(state.roleAssignments||defaults.initialRoleAssignments)[actor];return result?.length?result:['Member'];};
const iso=value=>{const n=Date.parse(value);return Number.isFinite(n)?new Date(n).toISOString().slice(0,10):'';};
function eligible(state,actor,now=Date.now()){
 const override=state.membershipTests?.[actor];if(override==='Pending Approval'||override==='Expired')return false;
 const record=records(state).find(r=>r.name===actor);if(!record||record.status!=='Active')return false;
 if(override==='Trial Member')return true; // Explicit test-only membership simulation.
 const date=iso(record.type==='Trial'?record.trialEnd:record.expiry),today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
 return !!date&&date>=today;
}
function requireMember(state,actor,now){if(!eligible(state,actor,now))throw Error('An approved, current membership is required to sign up. You can still browse events.');}
function assignRole(state,actor,role,member,targetRole,enabled,now=Date.now()){
 if(!roleOptions.includes(targetRole)||!memberNames(state,true).includes(member))throw Error('Choose an active member and valid role.');
 if(!access.allows(role,access.has(role,'Trips Committee')&&targetRole==='Trip Organiser'))throw Error('Only administrators assign committee roles. Trips Committee may assign Trip Organiser only.');
 const before=(state.roleAssignments||defaults.initialRoleAssignments)[member]||[];
 if(member==='Stu Block'&&targetRole==='Club Administrator'&&!enabled)throw Error('Protected app-maintainer administrator access cannot be removed here.');
 const after=enabled?[...new Set([...before,targetRole])]:before.filter(r=>r!==targetRole);
 return require('./clubModel').audit({...state,roleAssignments:{...(state.roleAssignments||defaults.initialRoleAssignments),[member]:after}},{type:'Role assignment changed',member,before,after,adminOverride:access.isAdmin(role)},actor,now);
}
const blankProfile={tradLevel:'Never tried',tradLead:'Not recorded',tradSecond:'Not recorded',sportLevel:'Never tried',sportLead:'Not recorded',sportTopRope:'Not recorded',boulderLevel:'Never tried',boulderIndoor:'Not recorded',boulderOutdoor:'Not recorded',experience:[]};
module.exports={blankProfile,roleOptions,migrate,records,memberNames,effectiveRoles,eligible,requireMember,assignRole};
