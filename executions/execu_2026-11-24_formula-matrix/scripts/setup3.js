const M = made.mod, L2 = made.layout2; const res = {};
res.depPlan = E(await api('PATCH', `/modules/${M}/records/${made.recFull}`, { data: data({ in_department: '19510fdc-91f3-4a7a-8888-153f1318b765', in_support_plan: 'bc1e5c23-8fcf-4e5d-b09b-a7b0ea630b8e' }) })).slice(0, 250);
const full = await getRec(M, made.recFull);
const copy = Object.fromEntries(Object.entries(full).filter(([k, v]) => /^in_/.test(k) && !['in_auto_number', 'in_rollup_summary', 'in_parent'].includes(k) && v !== null && v !== undefined));
const mk = async (key, lay, vals, label) => { if (made[key]) return made[key]; const r = await api('POST', `/modules/${M}/records`, { layout_id: lay, data: data(vals) }); res[key] = E(r).slice(0, 300); if (r.j?.data?.id) { made[key] = r.j.data.id; keep(); led('CRM QA FX Matrix record ' + label + ' ' + made[key]); } return made[key]; };
await mk('recFull2', L2, { ...copy, name: 'QA FX Matrix 2 - all filled' }, 'L2 all filled');
await mk('recEmpty2', L2, { name: 'QA FX Matrix 2 - all empty' }, 'L2 all empty');
await mk('child1', made.layout, { name: 'QA FX Matrix child of filled', in_parent: made.recFull, in_number: 5 }, 'child -> filled');
await mk('child2', L2, { name: 'QA FX Matrix 2 child of filled', in_parent: made.recFull2, in_number: 7 }, 'child -> L2 filled');
await sleep(4000);
// re-save parents so rollup + formulas are current
for (const id of [made.recFull, made.recFull2]) res['resave ' + id.slice(0, 8)] = E(await api('PATCH', `/modules/${M}/records/${id}`, { data: data({ name: id === made.recFull ? 'QA FX Matrix - all filled' : 'QA FX Matrix 2 - all filled' }) })).slice(0, 120);
await sleep(3000);
const recs = {}; for (const k of ['recFull', 'recEmpty', 'recFull2', 'recEmpty2']) { const r = await api('GET', `/modules/${M}/records/${made[k]}`); recs[k] = { id: made[k], layout: r.j?.data?.layout_id || r.j?.data?.layoutId, values: flat(r.j?.data?.data) }; }
fs.writeFileSync(RUN + '/out/records2.json', JSON.stringify(recs, null, 1));
res.summary = Object.fromEntries(Object.entries(recs).map(([k, r]) => [k, { id: r.id, layout: r.layout, inputsSet: Object.entries(r.values).filter(([n, v]) => /^in_/.test(n) && v != null && !(Array.isArray(v) && !v.length)).length, rollup: r.values.in_rollup_summary, fx: Object.keys(r.values).filter(n => /^fx_/.test(n)).length }]));
log(res);
