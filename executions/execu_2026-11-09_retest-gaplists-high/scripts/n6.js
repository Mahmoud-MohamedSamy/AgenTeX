const out={};
for(const q of ['','?limit=500','?pageSize=500','?page_size=500','?per_page=500','?take=500','?size=500']){for(const app of ['desk','crm']){const x=await api('GET','/iam/users'+(q?q+'&':'?')+'app_key='+app);const d=arr(x.j&&x.j.data);out[app+q]=[x.s,d.length,new Set(d.map(u=>u.userId)).size,JSON.stringify(x.j&&x.j.meta).slice(0,120)];}}
return out;
