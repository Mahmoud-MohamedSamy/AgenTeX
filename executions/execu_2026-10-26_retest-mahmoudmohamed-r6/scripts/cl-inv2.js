const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
const g = await api('GET', `/modules/${L}/records/3a22e4a4-5b26-441e-905c-c5fb4f3315ce`); out.convertedLead = g.s;
const conv = await api('GET', `/modules/${L}/records/3a22e4a4-5b26-441e-905c-c5fb4f3315ce/conversion`); out.conversion = conv.s + ' ' + conv.t.slice(0, 600);
const mods = arr((await api('GET', '/modules')).j?.data).filter(m => /subscriptions|agency_code/.test(m.moduleKey || ''));
for (const m of mods) { const a = arr((await api('GET', `/modules/${m.id}/records?page=1&per_page=50&sort_by=created_at&sort_dir=desc`)).j?.data); out[m.moduleKey] = a.filter(r => JSON.stringify(r.data || []).includes('QA RT 2323')).map(r => m.id.slice(0, 8) + ':' + r.id); }
for (const p of [`/modules/${D}/views`, `/modules/${D}/views?kind=kanban`, `/modules/${D}/kanban-views`, `/modules/${D}/views?type=kanban`]) { const r = await api('GET', p); out[p] = r.s + ' ' + JSON.stringify(arr(r.j?.data).map(v => (v.name || '') + '|' + (v.kind || v.type || '') + '|' + v.id)).slice(0, 400); }
return done(out);
