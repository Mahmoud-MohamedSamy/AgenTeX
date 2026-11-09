const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const recs = arr((await api('GET', `/modules/${L}/records?page=1&per_page=40&sort_by=created_at&sort_dir=desc`)).j?.data);
for (const name of ['QA RT 2302 tavi off', 'QA RT 2302 tavi on', 'QA RT 2302 tavi manual']) { const r = recs.find(x => (x.data || []).some(f => f.field === 'first_name' && (f.value?.value || '') === name)); if (!r) { out[name] = 'not found'; continue; }
  const bs = (await api('GET', `/modules/${L}/records/${r.id}/blueprint-state`)).j?.data; out[name] = { id: r.id, governed: (bs?.states || []).length > 0, state: (bs?.states || []).map(s => s.blueprintName + ':' + s.activeStates).join(',') }; }
for (const [name, tag] of [['QA RT 2302 tavi on', 'on'], ['QA RT 2302 tavi off', 'off']]) { if (out[name]?.id) { await go(`/modules/${L}/records/${out[name].id}`, 20000); await shot('2302-tavi-lead-' + tag); out[name].pageHasBlueprint = /QA chat to web|Current state|chat\s*→|Blueprint/i.test(await txt()); } }
return done(out);
