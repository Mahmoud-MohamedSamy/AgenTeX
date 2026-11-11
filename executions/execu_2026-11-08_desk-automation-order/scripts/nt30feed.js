const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const R={};
for(const id of n.tickets){const j=(await api('GET','/desk/tickets/'+id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
 R[id.slice(0,8)]=L.map(e=>(e.occurred_at||'').slice(11,19)+' '+(e.action||'')+' '+JSON.stringify(e.data||e.details||e.changes||{}).slice(0,160));}
const q=(await api('GET','/desk/queues/agents')).j;const ql=q?.data?.agents||q?.data||[];R.nt30InAgentList=ql.find(x=>(x.user_id||x.id)===n.uid)?.status||'not listed';
return R;
