const r=await api('GET','/settings/hub?app=desk');const t=JSON.stringify(r.j);
const m=[...t.matchAll(/"(?:route|path|href|url)":"([^"]+)"/g)].map(x=>x[1]).filter(x=>/skill|approv|assign|automation|workflow|field|module/i.test(x));
return {s:r.s,len:t.length,m:[...new Set(m)]};
