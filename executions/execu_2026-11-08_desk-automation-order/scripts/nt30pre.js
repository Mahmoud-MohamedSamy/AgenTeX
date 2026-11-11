const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b';const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const R={};
const r=(await api('GET','/desk/notification-rules/departments/'+A)).j?.data?.rules||[];R.rules=r.filter(x=>/^(agent|department)\./.test(x.key)).map(x=>x.key+'='+x.is_enabled);R.ruleSample=JSON.stringify(r.find(x=>x.key==='agent.ticket_assigned')).slice(0,400);
const q=await api('GET','/desk/queues/agents');const L=q.j?.data?.agents||q.j?.data||[];const me=L.find(x=>x.user_id===n.uid||x.id===n.uid);R.agent=me?{name:me.name,status:me.status,depts:me.department_ids}:'not listed';
return R;
