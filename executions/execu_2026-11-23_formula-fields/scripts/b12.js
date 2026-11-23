// Batch 12 (API): E24/E26 stored?, E29 rollup, F11, H11 restore, K6, K7, K9, K10, N1, N2. -> out/<app>-b12.json
const M = made.mod, LID = made.layouts[0]; const res = {}; const app = made.appKey || 'crm';
const mkRec = async (tag, vals, lid = LID) => { const r = await api('POST', `/modules/${M}/records`, { layout_id: lid, data: data({ name: 'QA FX ' + tag, ...vals }) }); if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); } return r; };
const fl = async () => L((await api('GET', `/modules/${M}/fields`)).j?.data);
// E24/E26 stored values
{ const recs = L((await api('GET', `/modules/${M}/records?limit=40&sort_by=created_at&sort_dir=desc`)).j?.data).map(x => flat(x.data));
  const a = recs.find(v => v.name === 'QA FX E24 r0'), l = recs.find(v => v.name === 'QA FX E26 r0'); res.E24_E26 = { addressStored: a?.qa_address, formula: a?.fx_e24, locationStored: l?.qa_loc, formulaLoc: l?.fx_e26 }; }
// E29 rollup (child module -> rollup on QA FX -> formula reading rollup)
{ const TS = app === 'desk' ? 'a641f1df-f2c6-450e-a881-857776dacf70' : '5ea90671-4df5-4642-939d-49494f8e4d6e';
  if (!made.child) { const c = await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: app === 'desk' ? 'qa_fx_desk_child' : 'qa_fx_child', labels: { en: 'QA FX Child' }, pluralForm: 'QA FX Child', singularForm: 'QA FX Child record', description: 'QA FX run - delete' }); if (c.s === 201) { made.child = c.j.data.id; keep(); led(app + ' module QA FX Child ' + made.child); } }
  const ch = made.child; const cf = await api('POST', `/modules/${ch}/fields`, { fields: [fdef('qa_parent', 'QA Parent', 'lookup', { target_module_id: M, related_list_title: 'QA FX children' }), fdef('qa_amount', 'QA Amount', 'number')] });
  const ru = await api('POST', `/modules/${M}/fields`, { fields: [fdef('qa_rollup', 'QA Rollup', 'rollup_summary', { target_module_id: ch, relation_field: 'qa_parent', target_field: 'qa_amount', aggregation: 'sum' })] });
  const fr = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_e29', 'QA FX E29', 'formula', { expression: 'qa_rollup + 1', return_kind: 'number' })] }); if (fr.s < 300) { made.fx.push('fx_e29'); keep(); }
  res.E29 = { child: E(cf), rollup: E(ru), formulaOnRollup: E(fr) }; }
// F11 subform column formula reading a parent field
{ const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef('qa_items_f11', 'QA Items F11', 'subform', { subfields: [{ key: 'qty', label: 'Qty', datatype: 'number' }, { key: 'line', label: 'Line', datatype: 'formula', expression: 'qty * qa_num' }] })] });
  res.F11 = { create: E(r) }; if (r.s < 300) { (made.extraFields ||= []).push('qa_items_f11'); keep(); const x = await mkRec('F11', { qa_num: 3, qa_items_f11: [{ qty: 2 }] }); res.F11.value = JSON.stringify(flat(x.j?.data?.data).qa_items_f11); } }
// H11 delete + restore from recycle bin
{ const r = await mkRec('H11', { qa_num: 6 }); const id = r.j.data.id; const d = await api('DELETE', `/modules/${M}/records/${id}`); let item = null;
  for (let i = 0; i < 8 && !item; i++) { await sleep(3000); const b = await api('GET', `/audit/recycle-bin/items?app_key=${app}&limit=200`); item = L(b.j?.data).find(x => x.record_id === id); }
  const rs = item ? await api('POST', '/audit/recycle-bin/restore', { ids: [item.id] }) : null; await sleep(3000); const v = await getRec(M, id);
  res.H11 = { delete: E(d), binItem: !!item, restore: rs && E(rs), fx_e7: v.fx_e7, verdict: v.fx_e7 === 12 ? 'PASS' : 'CHECK' }; }
// K6 change return_kind number -> string on an existing field
{ const f = (await fl()).find(x => x.fieldName === 'fx_c3'); const p = await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { expression: f.datatypeOptions.expression, return_kind: 'string' } });
  const r = await mkRec('K6', { qa_num: 10 }); res.K6 = { put: E(p), newValue: JSON.stringify(flat(r.j?.data?.data).fx_c3) };
  await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { expression: f.datatypeOptions.expression, return_kind: 'number' } }); }
// K7 rename a pick-list option used in a formula (qa_pick = "Blue")
{ const f = (await fl()).find(x => x.fieldName === 'qa_pick'); const vals = f.datatypeOptions.allowed_values;
  const p = await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { ...f.datatypeOptions, allowed_values: vals.map(v => v === 'Blue' ? 'Navy' : v) } });
  const r = await mkRec('K7', { qa_pick: 'Navy' }); const v = flat(r.j?.data?.data); const fb = (await fl()).find(x => x.fieldName === 'fx_e14_b');
  res.K7 = { rename: E(p), record: E(r), fx_e14_b: v.fx_e14_b, formulaText: fb.datatypeOptions.expression };
  await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { ...f.datatypeOptions, allowed_values: vals } }); }
// K9 / K10 second layout (clone) — formula on records made with layout B
{ const c = await api('POST', `/modules/${M}/layouts/${LID}/clone`, { name: 'QA FX Layout B' }); const lb = c.j?.data?.id; if (lb) { made.layoutB = lb; keep(); led(app + ' layout QA FX Layout B ' + lb); }
  const lay = lb ? (await api('GET', `/modules/${M}/layouts/${lb}`)).j.data : null; const hasUi = lay ? JSON.stringify(lay.views).includes('qa_fx_ui') : null;
  const r = lb ? await mkRec('K9 layoutB', { qa_num: 4 }, lb) : null; const v = r ? flat(r.j?.data?.data) : {};
  res.K10 = { clone: E(c), uiFormulaCopied: hasUi }; res.K9 = { record: r && E(r), fx_e7: v.fx_e7, ui: v.qa_fx_ui_double ?? v.qa_fx_ui_triple }; }
// N1 save time with ~100 formulas vs a module without formulas (child module)
{ const t = async (m, lid) => { const ts = []; for (let i = 0; i < 5; i++) { const a = Date.now(); const r = await api('POST', `/modules/${m}/records`, { ...(lid ? { layout_id: lid } : {}), data: data({ name: 'QA FX N1 ' + i, qa_num: i }) }); ts.push(Date.now() - a); if (r.j?.data?.id) { (m === M ? made.recs : (made.childRecs ||= [])).push(r.j.data.id); keep(); } } return ts; };
  const nf = (await fl()).filter(x => x.datatypeKey === 'formula').length; res.N1 = { formulas: nf, withFormulasMs: await t(M, LID), childModuleMs: await t(made.child) }; }
// N2 100 subform rows
{ const rows = Array.from({ length: 100 }, (_, i) => ({ qty: i + 1, price: 1 })); const a = Date.now(); const r = await mkRec('N2', { qa_items: rows }); const ms = Date.now() - a; const v = flat(r.j?.data?.data);
  res.N2 = { status: E(r), ms, sumPrice: v.fx_f1, count: v.fx_f3_rows, avgQty: v.fx_f2_avg, verdict: v.fx_f1 === 100 && v.fx_f3_rows === 100 && v.fx_f2_avg === 50.5 ? 'PASS' : 'CHECK' }; }
fs.writeFileSync(RUN + '/out/' + app + '-b12.json', JSON.stringify(res, null, 1));
for (const [k, v] of Object.entries(res)) log(k, JSON.stringify(v).slice(0, 700));
