// NDC-2259: more than 512 fields on one layout must be refused by the API.
const MID = 'd08b353d-3634-4290-8785-fc6b6ecec00f';
const lid = await initLayout(MID);
const have = new Set((await fieldsOf(MID)).map(f => f.fieldName));
const out = { batches: [] };
for (let b = 0; b < 11; b++) {
  const defs = []; for (let i = 0; i < 50; i++) { const n = `qa_rt_f${b * 50 + i}`; if (!have.has(n)) defs.push({ fieldName: n, labels: { en: 'QA RT f' + (b * 50 + i) }, datatypeKey: 'single_line', required: false, unique: false, uniquePeerModuleIds: [] }); }
  if (defs.length) { const r = await api('POST', `/modules/${MID}/fields`, { fields: defs }); out.batches.push(r.s + (r.s >= 300 ? ' ' + (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || '').slice(0, 120) : '')); if (r.s >= 300) break; }
}
const F = await fieldsOf(MID); out.fieldCount = F.length;
const lay = await getLayout(MID, lid); const ss = lay.views.CREATE.layout.sections; const col = ss[0].columns[0];
const custom = F.filter(f => /^qa_rt_f\d+$/.test(f.fieldName));
const onLayout = new Set(ss.flatMap(s => s.columns.flatMap(c => c.fields.map(f => f.id))));
for (const f of custom) if (!onLayout.has(f.id)) col.fields.push(JSON.parse(JSON.stringify(f)));
out.placedTotal = ss.flatMap(s => s.columns.flatMap(c => c.fields)).length;
const b = { ...lay }; delete b.id;
const put = await api('PUT', `/modules/${MID}/layouts/${lid}`, b);
out.put = put.s + ' ' + (put.s >= 300 ? (put.j?.error?.code || '') + ' ' + (put.j?.error?.message || '').slice(0, 200) : '');
const after = await getLayout(MID, lid); out.storedOnLayout = after.views.CREATE.layout.sections.flatMap(s => s.columns.flatMap(c => c.fields)).length;
return done(out);
