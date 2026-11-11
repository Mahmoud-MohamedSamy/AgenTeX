const j=JSON.parse(fs.readFileSync('../e2e2.json','utf8'));const c=await api('POST','/desk/tickets/'+j.close+'/close',{});return c.s;
