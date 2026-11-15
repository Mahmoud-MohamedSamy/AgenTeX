eval(fs.readFileSync('lib-as.js','utf8'));const r=await api('GET','/desk/notification-rules/departments/'+DA);const d=r.j?.data;const L=d?.rules||d?.items||(Array.isArray(d)?d:[]);
return {s:r.s,n:L.length,closeRules:L.filter(x=>/clos|resolv/i.test(x.key+x.use_case)).map(x=>x.category+" | "+x.key+" | "+x.use_case+" | enabled="+x.is_enabled+" email="+x.email_enabled)};
