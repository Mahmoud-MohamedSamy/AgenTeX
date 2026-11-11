let all=[]; for (let p=1;p<=5;p++){ const r=await api('GET','/desk/integrations/crm/failures?page_size=100&page='+p); const a=arr(r.j&&r.j.data); all=all.concat(a); if(a.length<100) break; }
const g={}; for (const f of all){ const k=[f.kind,f.error_code,f.direction,f.module_key,(f.failed_at||'').slice(0,10)].join(' | '); g[k]=(g[k]||0)+1; }
const errs={}; for (const f of all){ errs[f.last_error]=(errs[f.last_error]||0)+1; }
return {total:all.length, groups:g, errors:errs, newest: all.slice(0,3).map(f=>({kind:f.kind,err:f.last_error,at:f.failed_at,name:f.record_name}))};
