// These are durable in-app notices on this device, not push delivery.
function add(state,recipients,message,kind='trips',now=Date.now()){
 const notices=[...new Set(recipients)].filter(to=>state.notificationPreferences?.[to]?.[kind]!==false).map(to=>({id:require('./clubModel').makeId(),to,message,at:now}));
 return {...state,notifications:[...(state.notifications||[]),...notices]};
}
module.exports={add};
