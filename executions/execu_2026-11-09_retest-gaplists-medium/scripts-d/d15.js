const o={};
const f=await api('GET','/audit/recycle-bin/facets');o.facets=f.s+' '+f.t.slice(0,600);
for(const p of ['/audit/recycle-bin/items?module_key=departments','/audit/recycle-bin/items?module_key=desk_departments','/audit/recycle-bin/items?app_key=desk&module_key=department']){const r=await api('GET',p);const a=arr(r.j);o[p]={s:r.s,n:a.length,mods:[...new Set(a.map(x=>x.module_key))],old:a.filter(x=>/depart/i.test(x.module_key)&&x.deleted_at<'2026-11-04').map(x=>x.deleted_at.slice(0,10)+' '+(x.record_label||'').slice(0,30))};}
return o;
