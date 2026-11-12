const pr=await api('GET','/iam/profiles'); const ps=arr(pr.j&&pr.j.data); const out={profiles:ps.map(p=>p.name).slice(0,12)};
const adm=ps.find(p=>/admin/i.test(p.name))||ps[0]; const pm=await api('GET','/iam/profiles/'+adm.id+'/permissions'); const keys=(pm.t.match(/"[a-z_.:-]*scor[a-z_.:-]*"/gi)||[]); out.scoreKeys=[...new Set(keys)];
const cat=await api('GET','/iam/permissions'); out.catalog=cat.s+' '+[...new Set((cat.t.match(/"[a-z_.:-]*(scor|automation)[a-z_.:-]*"/gi)||[]))].slice(0,20).join(',');
return out;
