const out = {};
for (const p of ['/audit/events?app_key=crm&limit=5', '/audit/facets?app_key=crm', '/audit/login-history?limit=5', '/audit/recycle-bin/items?app_key=crm&limit=5', '/modules']) { const r = await api('GET', p); out[p] = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 120) : 'ok'); }
return done(out);
