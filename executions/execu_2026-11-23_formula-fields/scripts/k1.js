const M = made.mod; const out = {};
for (const [k, s] of [['catByFormula', { categorize_field: 'fx_d1', aggregate_field: null, header_style: 'default', card_fields: ['qa_fx_ui_double'] }], ['main', { categorize_field: 'qa_pick', aggregate_field: 'fx_e7', header_style: 'default', card_fields: ['qa_fx_ui_double', 'fx_d1'] }]]) {
  const r = await api('POST', `/modules/${M}/views`, { kind: 'kanban', name: 'QA FX I11 ' + k, layout_id: made.layouts[0], settings: s }); out[k] = E(r).slice(0, 250);
  if (r.j?.data?.id) { (made.views ||= []).push(r.j.data.id); keep(); led('CRM kanban view ' + r.j.data.id); if (k === 'main') made.kanban = r.j.data.id; keep(); } }
if (made.kanban) { const c = await api('GET', `/modules/${M}/records/board-columns?view_id=${made.kanban}`); out.columns = E(c) + ' ' + JSON.stringify(c.j?.data).slice(0, 500); const s = await api('GET', `/modules/${M}/records/board-summary?view_id=${made.kanban}`); out.summary = E(s) + ' ' + JSON.stringify(s.j?.data).slice(0, 600); }
// expected sum of fx_e7 per qa_pick from records
const by = {}; for (let p = 1; p <= 12; p++) { const r = await api('GET', `/modules/${M}/records?limit=100&page=${p}`); for (const v of L(r.j?.data).map(x => flat(x.data))) { const k = v.qa_pick ?? '(none)'; by[k] = by[k] || { n: 0, sum: 0 }; by[k].n++; by[k].sum += v.fx_e7 || 0; } if (!r.j?.meta?.more_records) break; }
out.expected = by; log(JSON.stringify(out, null, 1));
