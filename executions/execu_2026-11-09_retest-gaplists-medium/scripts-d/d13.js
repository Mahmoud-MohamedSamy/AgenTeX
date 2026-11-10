const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2805/ledger.md';
const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const o={};const tag=Date.now().toString(36).slice(-5);
const c=await api('POST','/desk/departments',{name:'QA RT 2805 Dept '+tag,agent_user_ids:[],visibility:'public'});
const D=c.j&&c.j.data&&(c.j.data.id||c.j.data.department&&c.j.data.department.id);o.create=c.s+' '+(D||c.t.slice(0,200));if(!D)return o;LED('CREATE department QA RT 2805 Dept '+tag+' '+D);
await sleep(2000);
const s0=await api('GET','/desk/skills?department_id='+D);o.seed={s:s0.s,skills:(s0.j.data.skills||[]).map(x=>x.name),types:(s0.j.data.types||[]).map(x=>x.name),prefs:s0.j.data.preferences};
const ty=(s0.j.data.types||[])[0];
const k=await api('POST','/desk/skills',{name:'QA RT 2805 sk '+tag,department_id:D,is_active:true,description:null,criteria:null,agent_ids:[],type_id:ty?ty.id:null});
const K=k.j&&k.j.data&&(k.j.data.id||(k.j.data.skill&&k.j.data.skill.id));o.skill=k.s+' '+(K||k.t.slice(0,200));if(K)LED('CREATE skill QA RT 2805 sk '+tag+' '+K+' in '+D);
const s1=await api('GET','/desk/skills?department_id='+D);o.before={skills:(s1.j.data.skills||[]).map(x=>x.name),types:(s1.j.data.types||[]).length,prefs:s1.j.data.preferences};
const del=await api('DELETE','/desk/departments/'+D);o.del=del.s+' '+del.t.slice(0,200);if(del.s<300)LED('DELETE department '+D+' (to recycle bin)');
await sleep(3000);
const bin=arr((await api('GET','/audit/recycle-bin/items')).j);const it=bin.find(i=>JSON.stringify(i).includes(D));o.binItem=it?{id:it.id,keys:Object.keys(it).slice(0,10)}:null;
if(it){const r=await api('POST','/audit/recycle-bin/restore',{ids:[it.id]});o.restore=r.s+' '+r.t.slice(0,200);if(r.s<300)LED('RESTORE department '+D+' from bin item '+it.id);}
await sleep(4000);
const s2=await api('GET','/desk/skills?department_id='+D);o.after={s:s2.s,skills:s2.j&&s2.j.data?(s2.j.data.skills||[]).map(x=>x.name):s2.t.slice(0,200),types:s2.j&&s2.j.data?(s2.j.data.types||[]).length:null,prefs:s2.j&&s2.j.data&&s2.j.data.preferences};
fs.writeFileSync('../ndc-2805/item4.json',JSON.stringify({D,K,o},null,1));
return o;
