const M=JSON.parse(fs.readFileSync('out/2799-made.json','utf8'));const t=M.tickets.PRIV1;
const a=await api('GET','/desk/tickets/'+t.id+'/activity');const items=arr(a.j?.data);
const out={keys:Object.keys(items[0]||{}),first:items.slice(0,4).map(x=>JSON.stringify(x).slice(0,400))};
const l=await api('GET','/desk/tickets?limit=15&sort=-created_at');out.list=l.s;out.recent=arr(l.j?.data).slice(0,15).map(x=>[x.number||x.ticket_number,x.created_at,(x.subject||x.title||'').slice(0,60),x.channel]);
return out;
