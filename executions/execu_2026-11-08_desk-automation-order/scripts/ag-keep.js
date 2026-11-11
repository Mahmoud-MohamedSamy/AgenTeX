// Presence keeper for one agent (node api.js "<label>" ag-keep.js). Control file SD/presence/<label>.txt, read every 20 s:
// on = all channels + heartbeat; emailoff = email off + heartbeat; off = sign-out; stop = sign-out and exit. Survives network errors.
const SD='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/presence';
const safe=async(...a)=>{try{return await api(...a);}catch(e){fs.appendFileSync(SD+'/log.txt',new Date().toISOString()+' net error '+e.message.slice(0,60)+'\n');return null;}};
let me=null;while(!me){me=(await safe('GET','/iam/me'))?.j?.data;if(!me)await sleep(10000);}
const lab=(me.display_name||me.user_id).replace(/[^a-z0-9]/gi,'_');fs.mkdirSync(SD,{recursive:true});const ctl=SD+'/'+lab+'.txt';if(!fs.existsSync(ctl))fs.writeFileSync(ctl,'on');
let last='',lastSet=0;const end=Date.now()+5*3600000;
while(Date.now()<end){let m='on';try{m=fs.readFileSync(ctl,'utf8').trim();}catch(e){}
 if(m!==last||Date.now()-lastSet>300000){let ok=true;
  if(m==='on')ok=!!(await safe('PUT','/desk/agents/me/presence',{channels:{email:true,chat:true,phone:true}}));
  if(m==='emailoff')ok=!!(await safe('PUT','/desk/agents/me/presence',{channels:{email:false,chat:true,phone:true}}));
  if(m==='off'||m==='stop')ok=!!(await safe('POST','/desk/agents/me/presence/sign-out',{}));
  if(ok){if(m!==last)fs.appendFileSync(SD+'/log.txt',new Date().toISOString()+' '+lab+' '+m+'\n');last=m;lastSet=Date.now();}}
 if(m==='stop'&&last==='stop')break;
 if(m==='on'||m==='emailoff')await safe('POST','/desk/agents/me/presence/heartbeat',{active:true});
 await sleep(20000);}
return {lab,ended:last};
