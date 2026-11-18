const out={};for(const p of ['/desk/agents','/desk/agents/','/iam/users?take=200','/iam/users?page_size=200','/desk/settings/agents']){const r=await api('GET',p);const a=arr(r.j?.data);out[p]=[r.s,a.length,a[0]?Object.keys(a[0]).slice(0,12):null];}
return out;
