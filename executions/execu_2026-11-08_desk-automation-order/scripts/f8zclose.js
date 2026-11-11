const j=JSON.parse(fs.readFileSync('../f8z.json','utf8'));const c=await api('POST','/desk/tickets/'+j.first+'/close',{});return c.s;
