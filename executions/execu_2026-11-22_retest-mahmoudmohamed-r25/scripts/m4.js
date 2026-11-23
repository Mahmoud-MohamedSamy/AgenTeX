const id='a5208ac8-16fb-4b8c-8d8a-bce2ec5dbd41';
const g=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+id); const r=await api('GET','/desk/tickets/'+id+'/replies'); const a=await api('GET','/desk/tickets/'+id+'/activity');
return {rec:g.s, del:g.j?.data?.is_deleted, rep:[r.s,r.t.slice(0,600)], act:[a.s,a.t.slice(0,800)]};
