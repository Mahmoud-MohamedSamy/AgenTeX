const g=await api('GET','/modules/'+TK+'/records/'+C.t3072);const d=g.j.data;log(Object.keys(d).join(','));log('layout keys',JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k])=>/layout/i.test(k)))));
log((d.data||[]).map(x=>x.field).join(','));
