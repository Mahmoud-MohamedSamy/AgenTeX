const a = await __z('GET','/api/v1/recycleBin?limit=100'); const t = await __z('GET','/api/v1/tickets/1475109000000556106'); const c = await __z('GET','/api/v1/contacts/1475109000000541087');
return { bin: (a.j?.data||[]).map(x=>x.type+': '+x.displayName), ticket169: t.s, contact: c.s };
