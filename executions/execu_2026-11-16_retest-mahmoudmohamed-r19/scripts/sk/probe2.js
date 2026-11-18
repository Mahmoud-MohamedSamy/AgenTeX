const DA='f4bb810f-5da4-4750-bb1d-4b47d60322fb';const R={};
const deps=(await api('GET','/desk/departments')).j?.data;const DL=Array.isArray(deps)?deps:(deps?.items||deps?.departments||[]);
const d=DL.find(x=>x.id===DA);R.agents=d.agent_user_ids;R.vo=d.view_only_agent_user_ids;
R.rr=((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[]).map(r=>JSON.stringify({n:r.name,a:r.is_active,on:r.execute_on,t:r.targets}));
const w=await api('GET','/workflow/rules/11577372-a189-4557-9139-8fd080a15331');R.wf=w.s+' '+w.t.slice(0,2500);
const all=arr((await api('GET','/workflow/rules?take=500')).j?.data);R.wfActiveSK13=all.filter(x=>x.isActive&&(x.departmentIds||[]).includes(DA)||x.isActive&&!(x.departmentIds||[]).length).map(x=>x.name+' '+x.id+' deps='+JSON.stringify(x.departmentIds)).slice(0,30);
const us=(await api('GET','/desk/agents?page_size=200')).j?.data;const UL=Array.isArray(us)?us:(us?.items||us?.agents||[]);R.agentNames=UL.filter(u=>(d.agent_user_ids||[]).includes(u.user_id||u.id)).map(u=>(u.user_id||u.id)+' '+(u.display_name||u.name||u.full_name));
return R;
