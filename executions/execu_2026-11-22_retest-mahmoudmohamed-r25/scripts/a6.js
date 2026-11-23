const M='88e8ea44-1658-4df3-9930-d0902b91073d';
const r=await api('GET','/modules/'+M+'/records?limit=100'); log(r.j.meta);
const b=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'); log('bin',b.s); for(const x of arr(b.j&&b.j.data)) if(/check/i.test(x.record_label||'')) log(x.record_label,x.deleted_at,x.id);
