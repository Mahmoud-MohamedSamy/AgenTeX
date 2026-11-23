const TU1='876ce871-2b02-4854-89a7-68050391c62b';
const d=(await api('GET','/desk/departments?limit=100')).j; const L=arr(d.data||d); log({depts:L.map(x=>x.name+' '+x.id)});
const w=(await api('GET','/desk/agents/'+TU1+'/workload')).j?.data; log({tu1:(w?.departments||[]).map(x=>x.department_name+' '+x.department_id+' open '+x.open_tickets), presence:w?.presence||w?.status||Object.keys(w||{})});
const a=(await api('GET','/desk/agents/'+TU1)).j?.data; log({agentKeys:Object.keys(a||{}), last:a?.last_active_at, online:a?.is_online, pres:a?.presence});
