const M='88e8ea44-1658-4df3-9930-d0902b91073d'; const all=[];
for (let p=1;p<=3;p++){ const r=await api('GET','/modules/'+M+'/records?limit=100&page='+p); for(const x of r.j.data){const o={};(x.data||[]).forEach(f=>o[f.field]=f.value&&f.value.value); all.push({id:x.id,n:o.ticket_number,s:o.subject,c:x.created_at,src:x.source,e:o.email});}}
log('total',all.length);
all.filter(x=>/check|2275/i.test(x.s||'')||(x.c>'2026-11-09T11'&&x.c<'2026-11-09T14')).forEach(x=>log(x));
fs.writeFileSync('../out/tickets-22nov.json',JSON.stringify(all));
