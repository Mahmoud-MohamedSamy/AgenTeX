const o={};
const pr=await api('GET','/iam/profiles');o.profS=pr.s;
const L=arr(pr.j&&pr.j.data);o.profiles=L.map(p=>({id:p.id,name:p.name,sys:p.isSystem??p.is_system,rank:p.rank}));
const ts=await api('GET','/teamspaces');o.ts=arr(ts.j&&ts.j.data).map(t=>({id:t.id,name:t.name,app:t.app||t.appKey}));
return o;
