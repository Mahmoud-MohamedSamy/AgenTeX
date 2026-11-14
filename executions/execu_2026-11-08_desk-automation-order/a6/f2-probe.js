const n = require('./bp/ndc'); const { call } = n;
(async () => { const m = await call('owner', 'GET', '/modules'); const d = m.json?.data; const arr = Array.isArray(d) ? d : (d?.modules || d?.items || []);
  for (const mod of arr.slice(0, 60)) { const f = await call('owner', 'GET', `/modules/${mod.id}/fields?take=300`); const fs = f.json?.data; const L = Array.isArray(fs) ? fs : (fs?.fields || fs?.items || []);
    const a = L.filter(x => /addr/i.test(JSON.stringify(x.datatype || x.dataType || x.type || '')) ); if (a.length) { console.log(mod.key || mod.name, mod.id, JSON.stringify(a[0]).slice(0, 900)); break; } }
  console.log('modules', arr.length); })();
