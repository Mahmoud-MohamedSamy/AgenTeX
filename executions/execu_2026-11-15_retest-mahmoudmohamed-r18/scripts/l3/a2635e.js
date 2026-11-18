const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8')).A35; const o={};
o.count=(await api('GET','/desk/tickets/'+I.t+'/activities/count')).t.slice(0,200);
o.ticketCounts=JSON.stringify((await api('GET','/desk/tickets/'+I.t)).j.data.counts);
const g=await api('GET','/modules/6fb19115-9356-40f0-b064-840d8f1fad93/records/'+I.e); o.eventGet=g.s;
for(const p of ['/recycle-bin?per_page=50','/recycle-bin/records?per_page=50','/desk/recycle-bin?per_page=50']){ const r=await api('GET',p); if(r.s<300){ o.bin=p+' '+(JSON.stringify(r.j.data).includes(I.e)?'event present':'not found'); break;} else o['bin '+p]=r.s; }
return o;
