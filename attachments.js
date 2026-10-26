import {Linking} from 'react-native';
// Picked files are copied out of the temporary cache so saved records survive restarts.
async function keep(uri,name){
 const {File,Directory,Paths}=require('expo-file-system');
 const folder=new Directory(Paths.document,'bcc-attachments');folder.create({idempotent:true,intermediates:true});
 const safe=String(name||'attachment').replace(/[^a-zA-Z0-9._-]/g,'_');
 const destination=new File(folder,Date.now()+'-'+Math.random().toString(36).slice(2)+'-'+safe);
 new File(uri).copy(destination);return destination.uri;
}
export async function pickProfilePhoto(){
 const picker=require('expo-image-picker');
 const result=await picker.launchImageLibraryAsync({mediaTypes:['images'],allowsEditing:true,aspect:[1,1],quality:0.75});
 if(result.canceled||!result.assets?.length)return null;
 const asset=result.assets[0];return keep(asset.uri,asset.fileName||'profile.jpg');
}
export async function pickAttachments(){
 const picker=require('expo-document-picker');const result=await picker.getDocumentAsync({multiple:true,copyToCacheDirectory:true,type:['image/*','application/pdf']});
 if(result.canceled)return [];
 return Promise.all(result.assets.map(async a=>({name:a.name,uri:await keep(a.uri,a.name),mimeType:a.mimeType||'',size:a.size||0})));
}
export async function openAttachment(file){
 if(!file?.uri)throw Error('This attachment has no saved file.');
 // iOS Quick Look is supplied by the native share sheet for local files.
 if(file.uri.startsWith('file:')){const sharing=require('expo-sharing');if(await sharing.isAvailableAsync())return sharing.shareAsync(file.uri,{mimeType:file.mimeType||undefined,UTI:file.mimeType==='application/pdf'?'com.adobe.pdf':undefined});}
 return Linking.openURL(file.uri);
}
