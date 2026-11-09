const fs=require('fs');const LED=m=>fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const o={};const pr=await api('GET','/iam/profiles');const L=arr(pr.j&&pr.j.data);
const ai=L.find(p=>p.name==='AI Agent');const us=L.find(p=>p.name==='User');
o.aiKeys=Object.keys(ai);o.ai=JSON.stringify(ai).slice(0,600);o.user=JSON.stringify(us).slice(0,300);
const id=ai.id||ai.profileId||ai.profile_id;o.id=id;
const r=await api('PATCH','/iam/profiles/'+id,{name:'AI Agent QA r2702'});o.rename={s:r.s,t:r.t.slice(0,300)};
if(r.s<300){LED('NDC-2702 renamed AI Agent -> "AI Agent QA r2702" ('+r.s+')');const b=await api('PATCH','/iam/profiles/'+id,{name:'AI Agent'});o.revert={s:b.s,t:b.t.slice(0,200)};LED('NDC-2702 revert name to "AI Agent" ('+b.s+')');}
const uid=us&&(us.id||us.profileId);if(uid){const u=await api('PATCH','/iam/profiles/'+uid,{name:'User'});o.userControl={s:u.s,t:u.t.slice(0,200)};}
const after=arr((await api('GET','/iam/profiles')).j.data).filter(p=>/AI Agent/.test(p.name)).map(p=>p.name+' sys='+(p.isSystem??p.is_system));o.after=after;
return o;
