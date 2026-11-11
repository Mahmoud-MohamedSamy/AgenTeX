const out={};
for (const p of ['/desk/roles','/iam/roles?app_key=desk','/iam/org-units','/iam/profiles?app_key=desk','/iam/profiles']) { const r = await api('GET',p); out[p]=r.s+' '+JSON.stringify(arr(r.j&&r.j.data).map(x=>x.name||x.label).slice(0,30)).slice(0,500); }
return out;
