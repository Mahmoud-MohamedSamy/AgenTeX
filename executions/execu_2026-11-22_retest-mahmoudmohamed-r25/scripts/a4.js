const M='88e8ea44-1658-4df3-9930-d0902b91073d';
const r = await api('GET','/modules/'+M+'/records/105927e1-32ea-45a0-97b8-ba4f314d99ce'); const d=r.j.data; const o={};(d.data||[]).forEach(x=>o[x.field]=x.value&&x.value.value); delete o.description; log(r.s, d.created_at, d.source, o);
for (const p of ['/desk/tickets/105927e1-32ea-45a0-97b8-ba4f314d99ce/threads','/desk/tickets/105927e1-32ea-45a0-97b8-ba4f314d99ce/activity']) { const x=await api('GET',p); log(p,x.s,x.t.slice(0,1500)); }
