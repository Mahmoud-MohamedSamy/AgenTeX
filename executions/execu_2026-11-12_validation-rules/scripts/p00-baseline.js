const mods = arr((await api('GET', '/modules')).j.data);
const out = {}; const summary = [];
for (const m of mods) {
  const r = await api('GET', '/modules/' + m.id + '/validation-rules');
  const list = arr(r.j && r.j.data);
  out[m.moduleKey] = { id: m.id, status: r.s, rules: list };
  if (r.s !== 200 || list.length) summary.push([m.moduleKey, r.s, list.length, list.map(x => x.name + '|' + x.status + '|' + (x.kind||'') + '|' + (x.mode||'')).join(' ; ').slice(0, 300)]);
}
fs.writeFileSync(RUN + '/out/baseline-' + APP + '-1112.json', JSON.stringify(out, null, 1));
log('modules', mods.length); summary.forEach(s => log(s));
const any = Object.values(out).flatMap(x => x.rules)[0];
if (any) { log('rule keys', Object.keys(any)); log('sample', JSON.stringify(any).slice(0, 2500));
  const mid = Object.values(out).find(x => x.rules.length).id;
  for (const p of ['/' + any.id, '/order', '/stats', '/usage', '/export']) { const r = await api('GET', '/modules/' + mid + '/validation-rules' + p); log('GET', p, r.s, E(r)); } }
