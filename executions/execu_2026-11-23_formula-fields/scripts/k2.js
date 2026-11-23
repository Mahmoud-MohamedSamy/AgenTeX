const M = made.mod; const out = {};
for (const n of [5, 10]) { const r = await api('POST', `/modules/${M}/records`, { layout_id: made.layouts[0], data: data({ name: 'QA FX I11 green ' + n, qa_pick: 'Green', qa_num: n }) }); made.recs.push(r.j.data.id); keep(); }
const r = await api('POST', `/modules/${M}/views`, { kind: 'kanban', name: 'QA FX I11 board', layout_id: made.layouts[0], settings: { categorize_field: 'qa_pick', aggregate_field: 'fx_e7', header_style: 'mono', card_fields: ['qa_fx_ui_double', 'fx_d1'] } });
out.create = E(r).slice(0, 250); if (r.j?.data?.id) { (made.views ||= []).push(r.j.data.id); made.kanban = r.j.data.id; keep(); led('CRM kanban view ' + r.j.data.id); }
if (made.kanban) { for (const p of [`board-columns?view_id=${made.kanban}`, `board-summary?view_id=${made.kanban}`]) { const c = await api('GET', `/modules/${M}/records/${p}`); out[p.split('?')[0]] = E(c) + ' ' + JSON.stringify(c.j?.data).slice(0, 700); } }
log(JSON.stringify(out, null, 1));
