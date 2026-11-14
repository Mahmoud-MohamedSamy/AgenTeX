const o={}; for(const id of I.R17) o[id.slice(0,8)]=await recVal(L,id,'qa_rt17_rep');
const a=await api('GET','/audit/events?limit=15&entity_id='+I.S17); o.audit=JSON.stringify(arr(a.j&&a.j.data).map(e=>(e.action||e.event_type)+' '+JSON.stringify(e.changes||e.metadata||'').slice(0,200))).slice(0,1500); o.as=a.s;
return o;
