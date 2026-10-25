const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),Module=require('module');
const React=require('react'),Renderer=require('react-test-renderer'),{act}=Renderer;
global.IS_REACT_ACT_ENVIRONMENT=true;
const saved=new Map();
const originalLoad=Module._load,originalJs=Module._extensions['.js'];
const host=name=>function Host(props){return React.createElement(name,props,props.children)};
const native=Object.fromEntries(['View','Text','TextInput','TouchableOpacity','ScrollView','Switch','SafeAreaView','StatusBar','Image'].map(n=>[n,host(n)]));
native.StyleSheet={create:x=>x};native.Alert={alert:()=>{}};native.Linking={openURL:()=>Promise.resolve()};
Module._load=function(request,parent,isMain){if(request==='react-native')return native;if(request==='@react-native-async-storage/async-storage')return {getItem:async k=>saved.get(k)||null,setItem:async(k,v)=>{saved.set(k,v)}};return originalLoad.call(this,request,parent,isMain)};
Module._extensions['.png']=(m)=>{m.exports=1};
Module._extensions['.js']=(m,filename)=>{if(path.dirname(filename)===__dirname&&['App.js','ClubExperience.js','TripServices.js'].includes(path.basename(filename))){const babel=require('@babel/core');const code=babel.transformSync(fs.readFileSync(filename,'utf8'),{configFile:false,babelrc:false,plugins:['@babel/plugin-transform-react-jsx','@babel/plugin-transform-modules-commonjs']}).code;m._compile(code,filename);}else originalJs(m,filename)};
const App=require('./App').default;
const textOf=n=>typeof n==='string'?n:n.children?.map(textOf).join('')||'';
const text=r=>textOf(r.root);
async function mount(){let r;await act(async()=>{r=Renderer.create(React.createElement(App));await new Promise(resolve=>setTimeout(resolve,0));});return r;}
async function press(r,label,partial=false){const nodes=r.root.findAll(n=>n.type==='TouchableOpacity'&&typeof n.props.onPress==='function'&&(partial?textOf(n).includes(label):textOf(n)===label));assert(nodes.length,`Button not found: ${label}\n${text(r).slice(0,1200)}`);await act(async()=>{nodes.sort((a,b)=>textOf(a).length-textOf(b).length)[0].props.onPress();await Promise.resolve();});}
test('screen regression: domestic lift offers, international flights, member privacy and restart',async()=>{
 let r=await mount();await press(r,'Member sign in');assert(text(r).includes('Your club'));
 await press(r,'Explore trips and book a place');assert(text(r).includes('Fontainebleau'));assert(text(r).includes('Peak District trad weekend'));
 await press(r,'Fontainebleau bouldering',true);assert(text(r).includes('Suggested flights'));assert(!text(r).includes('Travel and accommodation'));assert(!text(r).includes('Climbing plans'));await press(r,'Suggested flights',true);assert(text(r).includes('Charles de Gaulle'));
 await press(r,'‹ Trips');await press(r,'Portland sport weekend',true);await press(r,'Join trip');assert(text(r).includes('Booked'));
 await press(r,'Travel and accommodation',true);assert(text(r).includes('Brighton'));assert(text(r).includes('Horsham'));assert(text(r).includes('3 spaces available'));
 await press(r,'Group meal',true);assert(text(r).includes('Friday 26 March'));assert(!text(r).includes('Saturday dinner'));
 await press(r,'‹ Trips');await press(r,'...More');await press(r,'Member');await press(r,'MMembers');assert(text(r).includes('Approved to attend'));assert(!text(r).includes('Private competence assessments'));assert(!text(r).includes('Demo observation record'));
 assert(!text(r).includes('Rock Climbing Development Instructor'));await press(r,'Professional qualifications',true);assert(!text(r).includes('Rock Climbing Development Instructor'));
 await press(r,'...More');await press(r,'Committee Member');await press(r,'MMembers');await press(r,'Private competence assessments',true);await press(r,'Alice Denning');assert(text(r).includes('Read-only'));assert(!text(r).includes('Save competence decision and audit record'));
 await act(async()=>r.unmount());r=await mount();await press(r,'Member sign in');await press(r,'Explore trips and book a place');await press(r,'Portland sport weekend',true);assert(text(r).includes('Booked'));await act(async()=>r.unmount());
});
test('historical features: meetings, AGM, socials, courses, partner preferences and profile tools remain reachable',async()=>{
 const r=await mount();await press(r,'Member sign in');await press(r,'...More');await press(r,'Secretary');await press(r,'TTrips');await press(r,'Calendar');assert(text(r).includes('Brighton Climbing Club AGM'));assert(text(r).includes('BCC committee meeting'));assert(text(r).includes('+ Create AGM or committee meeting'));await press(r,'+ Create AGM or committee meeting');assert(text(r).includes('New AGM or committee meeting'));await press(r,'BACK');
 await press(r,'...More');await press(r,'Social & Culture Secretary');await press(r,'TTrips');await press(r,'Calendar');assert(text(r).includes('+ Create a social event'));await press(r,'+ Create a social event');assert(text(r).includes('New social event'));await press(r,'BACK');
 await press(r,'...More');await press(r,'Trip Organiser');await press(r,'TTrips');await press(r,'Portland sport weekend',true);await press(r,'Climbing plans',true);await press(r,'My climbing partner preferences');assert(text(r).includes('Same partner throughout the trip'));await press(r,'BACK');await press(r,'‹ Trips');await press(r,'MMembers');await press(r,'My grades and profile privacy',true);assert(text(r).includes('Edit climbing profile and privacy'));assert(text(r).includes('See who is looking'));await press(r,'...More');assert(text(r).includes('Contact the Safeguarding Officer'));await act(async()=>r.unmount());
});
