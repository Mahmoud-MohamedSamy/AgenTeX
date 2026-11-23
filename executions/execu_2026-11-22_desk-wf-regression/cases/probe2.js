const rid='cb7e6344-f00a-40b2-a5be-56ff42cbf8ac', tid='3183f5c5-790e-49e1-8acf-76f2f9342986';
const all = arr((await api('GET','/workflow/rules?moduleId='+T+'&take=200')).j.data);
const r = all.find(x=>x.id===rid);
const e = await api('GET','/workflow/executions?recordId='+tid);
const t = await getTicket(tid);
const ex2 = await api('GET','/workflow/executions?ruleId='+rid);
return { rule:{departmentIds:r.departmentIds, keys:Object.keys(r).join(','), criteria:r.criteria, actions:r.actions.map(a=>({t:a.type,fu:a.fieldUpdates}))}, execRec:{s:e.s, t:e.t.slice(0,600)}, execRule:ex2.t.slice(0,400), ticket:{subject:t.subject,department:t.department,priority:t.priority,status:t.status,layout:t.layout_id||t.layout}};
