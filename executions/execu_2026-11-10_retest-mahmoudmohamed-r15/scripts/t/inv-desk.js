const m = await api('GET', '/modules'); const mods = arr(m.j).map(x => ({ id: x.id, k: x.apiName || x.api_name || x.key || x.name }));
log('modules', m.s, mods.map(x => x.k).join(','));
const out = {};
for (const mo of mods) {
  const r = await api('GET', `/modules/${mo.id}/records?search=${encodeURIComponent('QA RT15')}&pageSize=200`);
  const rows = arr(r.j).map(x => x.id); if (rows.length) out[mo.k] = { id: mo.id, n: rows.length, s: r.s };
}
log('records', out);
const sla = await api('GET', '/desk/sla/policies'); log('sla', sla.s, arr(sla.j).filter(x => /QA RT15/.test(x.name)).map(x => x.name + ' ' + x.id));
const tm = await api('GET', '/desk/teams'); log('teams', tm.s, arr(tm.j).filter(x => /QA RT15/.test(x.name)).map(x => x.name + ' ' + x.id));
const wr = await api('GET', '/workflow/rules?pageSize=500'); log('rules', wr.s, arr(wr.j).filter(x => /QA RT15/.test(x.name)).map(x => x.name + ' ' + x.id + ' active=' + x.isActive));
const tg = await api('GET', '/desk/tags?pageSize=500'); log('tags', tg.s, arr(tg.j).filter(x => /QA RT15/.test(x.name)).map(x => x.name + ' ' + x.id));
