const ps=arr((await api('GET','/iam/profiles')).j.data); const u=ps.filter(p=>/^(User|Manager)$/.test(p.name)).map(p=>({id:p.id||p.profile_id||p.profileId,name:p.name,app:p.app_key||p.appKey}));
const out={profiles:u, k:Object.keys(ps[0])};
for(const p of u){ const pr=await api('GET','/iam/profiles/'+p.id+'/permissions'); const rows=arr(pr.j&&pr.j.data); out[p.name]={count:rows.length, keys:rows[0]&&Object.keys(rows[0]), gs:rows.filter(r=>/global_set/.test(JSON.stringify(r))).map(r=>JSON.stringify(r))}; }
return out;
