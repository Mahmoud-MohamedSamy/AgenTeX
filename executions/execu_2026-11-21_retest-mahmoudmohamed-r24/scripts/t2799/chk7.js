const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const M=JSON.parse(fs.readFileSync('out/2799-made.json','utf8'));const t=M.tickets.PRIV1;
const a=arr((await api('GET','/desk/tickets/'+t.id+'/activity')).j?.data).filter(x=>x.occurred_at>'2026-11-21T18:13');
const bs=(await api('GET','/modules/'+TK+'/records/'+t.id+'/blueprint-state')).j?.data;
const h=arr((await api('GET','/desk/tickets/'+t.id+'/history')).j?.data).slice(0,4);
return {act:a.map(x=>JSON.stringify(x).slice(0,600)),bs:JSON.stringify(bs).slice(0,1500),hist:h.map(x=>JSON.stringify(x).slice(0,500))};
