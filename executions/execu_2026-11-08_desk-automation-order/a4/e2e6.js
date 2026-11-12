// E2E-6 (12 Nov): diff the tenant's workflow rules and saved actions against the 11 Nov baseline.
const base = JSON.parse(fs.readFileSync('../a4/wf-baseline-rules.json', 'utf8')); const B = Array.isArray(base) ? base : (base.data || base.items || []);
const baseA = JSON.parse(fs.readFileSync('../a4/wf-baseline-actions.json', 'utf8')); const BA = Array.isArray(baseA) ? baseA : (baseA.data || baseA.items || []);
const now = arr2((await api('GET', '/workflow/rules?take=500')).j?.data);
const nowA = arr2((await api('GET', '/workflow/actions?moduleId=' + T)).j?.data);
const ids = new Set(B.map(r => r.id)), idsA = new Set(BA.map(a => a.id));
const changed = now.filter(r => ids.has(r.id)).filter(r => { const b = B.find(x => x.id === r.id); return b.isActive !== r.isActive || b.name !== r.name; }).map(r => r.name + ' active ' + B.find(x => x.id === r.id).isActive + '→' + r.isActive);
return {
  baseline: B.length, now: now.length,
  extra: now.filter(r => !ids.has(r.id)).map(r => [r.name, r.isActive, (r.createdAt || '').slice(0, 10)].join(' | ')),
  missing: B.filter(r => !now.some(x => x.id === r.id)).map(r => r.name),
  changed,
  actions: { baseline: BA.length, now: nowA.length, extra: nowA.filter(a => !idsA.has(a.id)).map(a => a.name), missing: BA.filter(a => !nowA.some(x => x.id === a.id)).map(a => a.name) }
};
