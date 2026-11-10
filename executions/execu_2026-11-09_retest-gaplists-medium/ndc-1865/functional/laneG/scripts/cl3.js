var RUNP='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG';
eval(require('fs').readFileSync(RUNP+'/scripts/lib.js','utf8'));
const o={};
const g=(await api('GET','/desk/departments/'+IDS.D)).j.data;
const p=await api('PATCH','/desk/departments/'+IDS.D,{...g,agent_user_ids:[]});o.patch=p.s+(p.s>=300?' '+E(p):'');LED('UPDATED QA FT dept: agents removed (for delete): '+p.s);
const d=await api('DELETE','/desk/departments/'+IDS.D);o.dept=d.s+(d.s>=300?' '+E(d):'');LED('CLEANUP delete department QA FT 1865 Dept: '+d.s);
await sleep(4000);
const list=async()=>{const all=[];let cur='';for(let i=0;i<10;i++){const q=await api('GET','/audit/recycle-bin/items?limit=200'+(cur?'&cursor='+cur:''));const L=(q.j&&q.j.data)||[];all.push(...L);cur=q.j&&q.j.meta&&q.j.meta.next_cursor;if(!cur)break;}return all;};
const mine=(await list()).filter(i=>i.record_id===IDS.D);o.bin=mine.map(i=>i.module_key+' / '+i.record_label);
if(mine.length){const q=await api('POST','/audit/recycle-bin/delete',{ids:mine.map(i=>i.id)});o.purge=q.s;LED('CLEANUP recycle bin purge department: '+q.s);await sleep(3000);}
o.deptGet=(await api('GET','/desk/departments/'+IDS.D)).s;o.binLeft=(await list()).filter(i=>i.record_id===IDS.D||/QA FT 1865/.test(i.record_label||'')).length;
o.inList=arr((await api('GET','/desk/departments')).j.data).filter(x=>x.id===IDS.D).length;
LED('VERIFY department: GET '+o.deptGet+', in list '+o.inList+', bin items left '+o.binLeft);
return o;
