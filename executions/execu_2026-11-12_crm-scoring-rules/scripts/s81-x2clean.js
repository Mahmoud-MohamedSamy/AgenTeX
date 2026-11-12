const L=await modId('leads'); const T=await modId('tasks'); const o={};
const rl=(await api('GET','/modules/'+L+'/records/'+I.x2lead+'/related-lists')).j.data.lists; const tasks=(rl.find(x=>x.sourceModuleKey==='tasks')||{records:[]}).records;
for(const t of tasks) o['task']=(await api('DELETE','/modules/'+T+'/records/'+t.id)).s;
o.wf=(await api('DELETE','/workflow/rules/'+I.x2wf)).s; o.lead=(await api('DELETE','/modules/'+L+'/records/'+I.x2lead)).s; o.rules=await delAllQA();
return o;
