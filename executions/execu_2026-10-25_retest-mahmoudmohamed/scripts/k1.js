const M = { Leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', Tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065' };
const out = {};
for (const [k, id] of Object.entries(M)) { const r = await api('GET', `/modules/${id}/fields`); const a = arr(r.j?.data); out[k] = a.filter(f => /lookup|user|owner|related/i.test(f.datatypeKey) && f.status !== 'deleted').map(f => (f.labels?.en || f.fieldName) + ' [' + f.apiName + '] ' + f.datatypeKey + ' layouts=' + (f.layouts || []).length); }
return done(out);
