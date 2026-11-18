const deps=(await api('GET','/desk/departments')).j?.data;const DL=Array.isArray(deps)?deps:(deps?.items||deps?.departments||[]);
const R={};const d=DL.find(x=>x.name==='QA SK13 Dept A');R.dept={id:d?.id,keys:Object.keys(d||{}),agents:d?.agent_ids||d?.agents};
R.rt19=DL.filter(x=>/RT19|SK13/.test(x.name)).map(x=>x.name+' '+x.id);
const sk=(await api('GET','/desk/skills?department_id='+d.id)).j?.data;R.skills=(sk?.skills||[]).map(s=>s.name+' act='+s.is_active+' ag='+(s.agent_ids||[]).length+' type='+s.type_id);
R.prefs=(await api('GET','/desk/departments/'+d.id+'/round-robin-preferences')).j?.data;
const wf=await api('GET','/workflow-rules/11577372-a189-4557-9139-8fd080a15331');R.wf=wf.s+' '+wf.t.slice(0,1500);
R.rules=((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+d.id)).j?.data?.rules||[]).map(r=>r.name+' act='+r.is_active);
return R;
