const o={}; for(const p of ['/desk/integrations/crm/imports/customers/00d4c4ab-366f-4790-8dbb-bb7984af2d65','/desk/integrations/crm/imports/00d4c4ab-366f-4790-8dbb-bb7984af2d65','/desk/integrations/crm/runs/00d4c4ab-366f-4790-8dbb-bb7984af2d65','/desk/integrations/crm/sync-history?page_size=3']){const r=await api('GET',p); o[p.split('/').slice(-2).join('/')]=r.s+' '+r.t.slice(0,900);}
let all=[]; for (let p=1;p<=5;p++){ const r=await api('GET','/desk/integrations/crm/failures?page_size=100&page='+p); const a=arr(r.j&&r.j.data); all=all.concat(a); if(a.length<100) break; }
o.failuresSinceRun=all.filter(f=>(f.failed_at||'')>='2026-11-13T09:19').map(f=>({name:f.record_name,err:f.last_error,dir:f.direction,at:f.failed_at}));
o.b04=all.filter(f=>/B04/.test(f.record_name||'')).map(f=>({err:f.last_error,at:f.failed_at,status:f.status}));
return o;
