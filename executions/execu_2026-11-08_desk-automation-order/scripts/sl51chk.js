const U1='48f1cdbb-a6a3-4ec1-885f-adfff50b7729',AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';const S=JSON.parse(fs.readFileSync('../sl51.json','utf8'));const R={};
const q=await api('GET','/desk/queues/agents');const list=q.j?.data||q.j?.items||[];const a=(Array.isArray(list)?list:[]).find(x=>(x.id||x.user_id)===U1);R.queues=q.s+' agent '+(a?JSON.stringify({name:a.name||a.display_name,status:a.status,depts:a.department_ids}):'not listed');
R.inDeptA=(await api('GET','/desk/departments/'+AO)).j?.data?.agent_user_ids?.includes(U1);
const p=await api('GET','/desk/sla/policies/'+S.pid);R.policy=p.s+' active='+p.j?.data?.is_active+' '+((p.t.match(/"recipients":\[[^\]]*\]/g)||[]).join(' | '));
const w=await api('GET','/desk/agents/'+U1+'/workload');R.workload=w.s+' '+w.t.slice(0,300);
return R;
