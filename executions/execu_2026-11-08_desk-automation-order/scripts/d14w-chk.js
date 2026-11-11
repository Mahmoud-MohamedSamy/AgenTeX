const T='88e8ea44-1658-4df3-9930-d0902b91073d';const d=JSON.parse(fs.readFileSync('../d14w.json','utf8'));const N={'876ce871-2b02-4854-89a7-68050391c62b':'A1 Test User 1','d23fb4e0-248d-41f6-af60-d28885a7007e':'A2','5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4':'A3'};const R={tickets:[]};
const l=await api('GET','/modules/'+T+'/records?page=1&per_page=50&sort_by=created_at&sort_dir=desc');
for(const x of (l.j?.data||[])){const g=k=>{const f=x.data.find(e=>e.field===k);return f?.value?.value;};if(!String(g('subject')).includes(d.u))continue;
 const j=(await api('GET','/desk/tickets/'+x.id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
 R.tickets.push({id:x.id,num:g('ticket_number')||g('number'),subject:g('subject'),owner:N[g('owner')]||g('owner')||'none',channel:g('channel'),created:x.created_at?.slice(11,19),feed:L.map(e=>(e.action||'')+' '+JSON.stringify(e.data||e.details||{}).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<e>').slice(0,140))});}
d.tickets=R.tickets.map(t=>t.id);fs.writeFileSync('../d14w.json',JSON.stringify(d));return R;
