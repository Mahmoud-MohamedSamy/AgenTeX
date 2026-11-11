const T='88e8ea44-1658-4df3-9930-d0902b91073d';const R={};const ids=new Set();
for(const fn of ['../f8z.json','../f8z-p0.json','../f8.json','../f8-p0.json']){if(!fs.existsSync(fn))continue;const t=fs.readFileSync(fn,'utf8');for(const m of t.matchAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g))ids.add(m[0]);}
const out=[];for(const id of ids){const r=await api('GET','/modules/'+T+'/records/'+id);if(r.s!==200)continue;const d=r.j?.data?.data||[];const g=k=>d.find(e=>e.field===k)?.value?.value;out.push([id,g('ticket_number'),String(g('subject')).slice(0,50),g('status')]);}
R.idsChecked=ids.size;R.existingTickets=out.map(x=>x.slice(1).join(' | '));fs.writeFileSync('../f8-left.json',JSON.stringify(out));return R;
