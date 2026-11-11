const m=JSON.parse(fs.readFileSync('../ar1-made.json','utf8'));const ids=m.tickets.slice(-6);const R={};
const d=(await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+ids[0])).j?.data?.data||[];
R.skillFields=d.filter(x=>/skill/i.test(x.field)).map(x=>x.field+'='+JSON.stringify(x.value).slice(0,200));
const j=(await api('GET','/desk/tickets/'+ids[0]+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
R.feed0=L.map(e=>e.action+' '+JSON.stringify(e.summary||{}).slice(0,220));
const j5=(await api('GET','/desk/tickets/'+ids[5]+'/activity')).j;const L5=Array.isArray(j5?.data)?j5.data:(j5?.data?.items||[]);
R.feed5=L5.map(e=>e.action+' '+JSON.stringify(e.summary||{}).slice(0,220));
return R;
