const out={};
const q=async p=>{const r=await api('GET','/iam/users'+p); const a=arr(r.j&&r.j.data); return {s:r.s, rows:a.length, first:(a[0]||{}).displayName, last:(a[a.length-1]||{}).displayName, active:a.filter(x=>x.status==='active').length, invited:a.filter(x=>x.status!=='active').length, meta:JSON.stringify(r.j&&r.j.meta).slice(0,250)};};
for (const p of ['','?page=2','?pageSize=5','?page=2&pageSize=100','?page_size=5','?per_page=5','?limit=5&offset=5','?cursor=x','?search=Mahmoud','?q=Mahmoud','?status=invited','?status=active','?page=1&pageSize=50','?page=5&pageSize=50']) out[p||'(none)']=await q(p);
for (const p of ['/iam/users/search?q=a','/iam/users/count','/iam/users/summary']) { const r=await api('GET',p); out[p]=r.s+' '+r.t.slice(0,150); }
return out;
