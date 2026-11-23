const M=JSON.parse(fs.readFileSync('out/2799-made.json','utf8'));const t=M.tickets.PRIV1;
const r=await api('GET','/desk/tickets/'+t.id+'/replies');const x=arr(r.j?.data)[0]||{};
const o={replyKeys:Object.keys(x),reply:JSON.stringify(x).slice(0,1500)};
const q=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?page=1&per_page=3&sort_by=created_at&sort_dir=desc');
const n=arr(q.j?.data)[2];o.newId=n?.id;
const a=await api('GET','/desk/tickets/'+n.id+'/activity');o.newAct=arr(a.j?.data).slice(-4).map(y=>JSON.stringify(y).slice(0,700));
return o;
