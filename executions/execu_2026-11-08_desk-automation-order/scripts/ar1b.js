const m=JSON.parse(fs.readFileSync('../ar1-made.json','utf8'));const id=m.tickets[0];
const j=(await api('GET','/desk/tickets/'+id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
const rec=(await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+id)).j?.data?.data||[];
return {feed:L.map(e=>e.action+' @'+(e.occurred_at||'').slice(11,19)+' '+JSON.stringify(e.actor).slice(0,80)+' '+JSON.stringify(e.summary||{}).slice(0,260)),fields:rec.filter(x=>/owner|subject|team/.test(x.field)).map(x=>x.field+'='+JSON.stringify(x.value).slice(0,100))};
