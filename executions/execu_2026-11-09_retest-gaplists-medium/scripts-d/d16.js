const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2805/ledger.md';
const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const D='856b6e94-3dbf-4d74-89b2-8f7e7ed2a4a0',K='f0080c29-e182-48bb-83cc-910028059079',TY='35173e88-a220-4756-83f2-8f473bea707e';const q='?department_id='+D;const o={};
let r=await api('DELETE','/desk/skills/'+K+q);o.skill=r.s+' '+(r.s>=300?r.t.slice(0,150):'');LED('CLEANUP DELETE skill '+K+' → '+r.s);
r=await api('DELETE','/desk/skill-types/'+TY);o.type=r.s+' '+(r.s>=300?r.t.slice(0,150):'');LED('CLEANUP DELETE skill type '+TY+' → '+r.s);
r=await api('DELETE','/desk/departments/'+D);o.dept=r.s+' '+(r.s>=300?r.t.slice(0,150):'');LED('CLEANUP DELETE department '+D+' → '+r.s);
await sleep(3000);
const bin=arr((await api('GET','/audit/recycle-bin/items')).j);const its=bin.filter(i=>[D,K,TY].includes(i.record_id));o.bin=its.map(i=>i.id);
if(its.length){r=await api('POST','/audit/recycle-bin/delete',{ids:its.map(i=>i.id)});o.purge=r.s+' '+r.t.slice(0,150);LED('CLEANUP PURGE bin ids '+its.map(i=>i.id).join(',')+' → '+r.s);}
await sleep(2000);
const v1=await api('GET','/desk/departments/'+D);const bin2=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>[D,K,TY].includes(i.record_id));
const f=arr((await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields')).j).find(x=>x.apiName==='skills');
o.verify={dept:v1.s,binLeft:bin2.length,optionLeft:JSON.stringify(f.datatypeOptions).includes('QA RT 2805')};LED('VERIFY dept GET '+v1.s+', bin left '+bin2.length+', field option left '+o.verify.optionLeft);
return o;
