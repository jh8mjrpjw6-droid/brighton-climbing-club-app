// All feature permissions must go through this policy. Administrators inherit
// every current and future feature; data validity and participant privacy still apply.
const isAdmin=role=>role==='Club Administrator';
const allows=(role,ordinaryPermission=false)=>isAdmin(role)||!!ordinaryPermission;
const features=(role,rules)=>Object.fromEntries(Object.entries(rules).map(([key,value])=>[key,allows(role,value)]));
module.exports={isAdmin,allows,features};
