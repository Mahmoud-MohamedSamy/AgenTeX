const out={};
for (const p of ['/audit/events?app_key=desk&app_key=iam&limit=200','/audit/events?limit=200']) { const r=await api('GET',p); const a=arr(r.j&&r.j.data); const c={}; a.forEach(x=>{c[x.app_key]=(c[x.app_key]||0)+1;}); out[p]={s:r.s,n:a.length,apps:c, crmSample:a.filter(x=>x.app_key&&!['desk','iam'].includes(x.app_key)).slice(0,3).map(x=>x.app_key+' '+x.target_type+' '+x.target_label)}; }
const f=await api('GET','/audit/events/facets?app_key=desk&app_key=iam'); out.facets=f.s+' '+f.t.slice(0,600);
return out;
