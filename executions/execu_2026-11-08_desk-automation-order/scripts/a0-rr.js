const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';
const rr=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+D)).j?.data?.rules||[];
const pref=(await api('GET','/desk/departments/'+D+'/round-robin-preferences')).t.slice(0,600);
const ag=(await api('GET','/desk/queues/agents')).j?.data;const AL=Array.isArray(ag)?ag:(ag?.agents||ag?.items||[]);
return {pref,agents:AL.filter(a=>a.department_ids?.includes(D)).map(a=>a.name+' online='+a.presence?.online+' email='+a.presence?.channels?.email),
rules:rr.map(r=>({n:r.name,on:r.is_active,ex:r.execute_on,m:r.method||r.config?.method,keys:Object.keys(r).join(','),raw:JSON.stringify(r).slice(0,700)}))};
