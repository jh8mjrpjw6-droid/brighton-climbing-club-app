// Every restricted feature inherits administrator access. Message content remains participant-only.
const roles=value=>Array.isArray(value)?value:[value||'Member'];
const has=(value,...wanted)=>roles(value).some(role=>wanted.includes(role));
const isAdmin=value=>has(value,'Club Administrator');
const allows=(role,ordinaryPermission=false)=>isAdmin(role)||!!ordinaryPermission;
const features=(role,rules)=>Object.fromEntries(Object.entries(rules).map(([key,value])=>[key,allows(role,value)]));
const label=value=>roles(value).join(' · ');
const only=(value,role)=>roles(value).every(r=>r===role||r==='Member');
module.exports={roles,has,isAdmin,allows,features,label,only};
