const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const v = await api('GET', `/modules/${L}/views?kind=list`); const mine = (v.j?.data?.views || []).filter(x => /^\s*qa rt/i.test(x.name || ''));
const out = { status: v.s, found: mine.map(x => x.id + ' ' + x.name) };
for (const x of mine) { const r = await api('DELETE', `/modules/${L}/views/${x.id}`); out[x.name] = r.s; }
const p = await api('GET', `/modules/${L}/list-preferences`); out.prefs = JSON.stringify(p.j?.data?.prefs || {}).slice(0, 200);
return out;
