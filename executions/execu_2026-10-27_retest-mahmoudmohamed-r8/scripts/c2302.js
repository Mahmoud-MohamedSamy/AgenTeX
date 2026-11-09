const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const recs = arr((await api('GET', `/modules/${L}/records?page=1&per_page=30&sort_by=created_at&sort_dir=desc`)).j?.data);
const r = recs.find(x => (x.data || []).some(f => f.field === 'first_name' && /QA RT 2302 tavi off/.test(f.value?.value || '')));
if (!r) return done({ err: 'lead not found' });
const bs = await api('GET', `/modules/${L}/records/${r.id}/blueprint-state`);
const g = {}; for (const f of r.data || []) if (/source|entry_channel|lead_source|created_at/.test(f.field)) g[f.field] = f.value?.value;
await go(`/modules/${L}/records/${r.id}`, 20000); await shot('2302-tavi-lead-off');
const t = (await txt()).split('\n').filter(l => /Blueprint|Current state|chat|web|Transition|QA chat/i.test(l)).slice(0, 8);
return done({ id: r.id, fields: g, blueprintState: bs.s + ' ' + bs.t.slice(0, 400), page: t });
