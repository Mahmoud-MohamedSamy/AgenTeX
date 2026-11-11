const out={};
for (const p of ['/iam/users/directory?scope=org','/iam/users/directory?scope=org&app_key=desk','/iam/users/directory?include=suspended']) { const r=await api('GET',p); const a=arr(r.j&&r.j.data); out[p]={s:r.s, rows:a.length, zamzam:a.some(x=>/Zamzam/i.test(x.displayName||x.display_name||x.name||'')), meta:JSON.stringify(r.j&&r.j.meta).slice(0,120)}; }
return out;
