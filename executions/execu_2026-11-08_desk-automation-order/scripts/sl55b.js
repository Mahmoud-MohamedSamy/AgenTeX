const id='bbec2b2f-a2a8-43dd-8ab0-04ab240cb38f';const j=(await api('GET','/desk/tickets/'+id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
const e=L.find(x=>x.action==='sla.escalation_fired');
const ag=(await api('GET','/desk/queues/agents')).j;const AL=Array.isArray(ag?.data)?ag.data:(ag?.data?.agents||ag?.data?.items||[]);
const deptOf=id=>{const a=AL.find(x=>(x.user_id||x.id||x.userId)===id);return a?JSON.stringify(a.department_ids||a.departments||a.departmentIds||'?').slice(0,200):'not an agent';};
return {actions:(e?.summary?.actions||[]).map(a=>({to:a.to,kind:a.kind,outcome:a.outcome,reason:a.reason,depts:deptOf(a.to)})),agentKeys:AL[0]?Object.keys(AL[0]).join(','):null};
