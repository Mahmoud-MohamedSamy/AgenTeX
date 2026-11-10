const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2805/ledger.md';
const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const D='856b6e94-3dbf-4d74-89b2-8f7e7ed2a4a0';const o={};const q='?department_id='+D;
const t=await api('POST','/desk/skill-types'+q,{name:'QA RT 2805 Type',department_id:D});const TY=t.j&&t.j.data&&(t.j.data.id||(t.j.data.type&&t.j.data.type.id)||(t.j.data.types&&t.j.data.types.find(x=>/QA RT 2805/.test(x.name))||{}).id);o.type=t.s+' '+(TY||t.t.slice(0,200));if(TY)LED('CREATE skill type QA RT 2805 Type '+TY+' in '+D);
const k=await api('POST','/desk/skills'+q,{name:'QA RT 2805 sk1',department_id:D,is_active:true,description:null,criteria:null,agent_ids:[],type_id:TY||null});
const K=k.j&&k.j.data&&(k.j.data.id||(k.j.data.skill&&k.j.data.skill.id)||((k.j.data.skills||[]).find(x=>/QA RT 2805/.test(x.name))||{}).id);o.skill=k.s+' '+(K||k.t.slice(0,250));if(K)LED('CREATE skill QA RT 2805 sk1 '+K+' in '+D);
const p=await api('GET','/desk/skill-preferences'+q);o.prefs0=p.j&&p.j.data;
const s1=await api('GET','/desk/skills'+q);o.before={skills:(s1.j.data.skills||[]).map(x=>x.name+'/'+x.id.slice(0,8)),types:(s1.j.data.types||[]).map(x=>x.name),prefs:s1.j.data.preferences};
if(!K)return o;
const del=await api('DELETE','/desk/departments/'+D);o.del=del.s;if(del.s<300)LED('DELETE department '+D+' (2nd, to bin)');
await sleep(3000);
const bin=arr((await api('GET','/audit/recycle-bin/items')).j);const it=bin.find(i=>i.record_id===D);o.binItem=it&&it.id;
if(it){const r=await api('POST','/audit/recycle-bin/restore',{ids:[it.id]});o.restore=r.s;if(r.s<300)LED('RESTORE department '+D+' bin item '+it.id);}
await sleep(4000);
const s2=await api('GET','/desk/skills'+q);o.after={skills:(s2.j.data.skills||[]).map(x=>x.name+'/'+x.id.slice(0,8)),types:(s2.j.data.types||[]).map(x=>x.name),prefs:s2.j.data.preferences};
const f=arr((await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields')).j).find(x=>x.apiName==='skills');o.fieldHasOption=JSON.stringify(f.datatypeOptions).includes('QA RT 2805 sk1');
fs.writeFileSync('../ndc-2805/item4b.json',JSON.stringify({D,TY,K,o},null,1));
return o;
