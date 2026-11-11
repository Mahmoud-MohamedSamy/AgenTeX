const out={};
for (const p of ['/desk/integrations/crm/status','/desk/integrations/crm/failures?page_size=100','/desk/integrations/crm/sync-history?page_size=5','/desk/integrations/crm/queue']) { const r=await api('GET',p); const a=arr(r.j&&r.j.data); out[p]={s:r.s, n:a.length, meta:JSON.stringify(r.j&&r.j.meta).slice(0,200), sample:JSON.stringify(a.slice(0,3)).slice(0,600), raw: a.length?undefined:r.t.slice(0,400)}; }
return out;
