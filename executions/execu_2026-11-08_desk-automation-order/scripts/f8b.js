// F-08 as A1: close the first ticket.
const j=JSON.parse(fs.readFileSync('../f8.json','utf8'));const c=await api('POST','/desk/tickets/'+j.first+'/close',{});return c.s+' '+c.t.slice(0,120);
