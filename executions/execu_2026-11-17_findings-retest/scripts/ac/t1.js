let r=await api('GET','/desk/departments/'+DEP.CS); log('cs',r.s,JSON.stringify(D(r.j)||r.t).slice(0,900));
r=await api('GET','/desk/departments'); const ds=(D(r.j)||[]); log('n',r.s,(Array.isArray(ds)?ds:ds.items||[]).filter(d=>/Customer Support|Sales/.test(d.name)).map(d=>JSON.stringify(d).slice(0,600)));
