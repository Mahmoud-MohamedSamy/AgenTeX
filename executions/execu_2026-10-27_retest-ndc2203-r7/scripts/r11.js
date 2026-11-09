const out = {}; const ca = arr((await api('GET', '/workflow/custom-actions')).j?.data); out.ca = ca.map(c => ({ id: c.id, name: c.name, src: c.sourceId, st: c.status, apps: c.targetApps }));
for (const p of ['/integrations/api-sources', '/workflow/sources', '/integrations/sources', '/workflow/api-sources', '/integrations/connections', '/workflow/connections', '/integrations/apis']) { const r = await api('GET', p); out[p] = r.s + ' ' + (r.s < 300 ? JSON.stringify(arr(r.j?.data).map(x => ({ id: x.id, name: x.name || x.displayName, url: x.baseUrl }))).slice(0, 400) : ''); }
return done(out);
