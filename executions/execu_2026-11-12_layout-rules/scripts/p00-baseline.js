// GET-only baseline: modules, layouts, layout rules per module (APP=crm|desk)
const OUT = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/out/';
const app = process.env.APP || 'crm';
const mods = arr((await api('GET', '/modules')).j?.data);
const res = { app, at: new Date().toISOString(), modules: [] };
for (const m of mods) {
  const r = await api('GET', '/modules/' + m.id + '/layout-rules');
  const L = await api('GET', '/modules/' + m.id + '/layouts');
  const rules = arr(r.j?.data);
  res.modules.push({ key: m.moduleKey, id: m.id, name: m.name || m.label, status: r.s, rules, layouts: arr(L.j?.data).map(x => ({ id: x.id, name: x.name, isDefault: x.isDefault ?? x.is_default })) });
}
fs.writeFileSync(OUT + 'baseline-' + app + '-1112.json', JSON.stringify(res, null, 1));
return res.modules.map(m => [m.key, m.status, m.rules.length, m.layouts.length].join(' '));
