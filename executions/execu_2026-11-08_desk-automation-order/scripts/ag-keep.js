// Presence keeper for one agent (run: node api.js "<label>" ag-keep.js). Reads SD/presence/<label>.txt each 30 s:
// on = all channels on + heartbeat; emailoff = email off, chat/phone on + heartbeat; off = sign-out; stop = sign-out and exit.
const SD='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/presence';
const me=(await api('GET','/iam/me')).j?.data;const lab=(me?.display_name||me?.user_id||'x').replace(/[^a-z0-9]/gi,'_');
fs.mkdirSync(SD,{recursive:true});const ctl=SD+'/'+lab+'.txt';if(!fs.existsSync(ctl))fs.writeFileSync(ctl,'on');
let last='';const end=Date.now()+4*3600000;
while(Date.now()<end){const m=fs.readFileSync(ctl,'utf8').trim();
 if(m!==last){if(m==='on')await api('PUT','/desk/agents/me/presence',{channels:{email:true,chat:true,phone:true}});
  if(m==='emailoff')await api('PUT','/desk/agents/me/presence',{channels:{email:false,chat:true,phone:true}});
  if(m==='off'||m==='stop')await api('POST','/desk/agents/me/presence/sign-out',{});
  fs.appendFileSync(SD+'/log.txt',new Date().toISOString()+' '+lab+' '+m+'\n');last=m;}
 if(m==='stop')break;
 if(m==='on'||m==='emailoff')await api('POST','/desk/agents/me/presence/heartbeat',{active:true});
 await sleep(30000);}
return {lab,ended:last};
