const out={};
for (const p of ['/iam/permissions','/iam/permissions/catalog','/iam/me/permissions']) { const r = await api('GET',p); const t=r.t; const m = (r.t.match(/crm:global_set:[a-z_]+/g)||[]); out[p]=r.s+' '+[...new Set(m)].join(',')+' len'+t.length; }
for (const p of ['/audit/logs?limit=30','/audit/audit-log?limit=30','/audit/events?limit=30','/audit/entries?limit=30']) { const r = await api('GET',p); out[p]=r.s+' '+(r.t.match(/[Gg]lobal[ _]?[Ss]et[^"]{0,60}/g)||[]).slice(0,8).join(' | '); }
return out;
