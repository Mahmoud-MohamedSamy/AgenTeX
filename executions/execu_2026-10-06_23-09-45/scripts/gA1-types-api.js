// Group A1 (owner) — module "QA MF Types": setup + API checks for I7, I19, I23, I24, I29, I36 (+ I3 in "QA MF Limit").
const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const T = await mkModule('qa_mf_types', 'QA MF Types');
const L = await initLayout(T.id);
const ctx = { T: T.id, L };
await step('A1.setup', async () => {
  const f1 = await addFields(T.id, [
    { fieldName: 'qa_cb', datatypeKey: 'checkbox' },
    { fieldName: 'qa_txt', datatypeKey: 'single_line' },
    { fieldName: 'qa_pl', datatypeKey: 'pick_list', datatypeOptions: { allowed_values: ['Alpha', 'Beta', 'Gamma'] } },
    { fieldName: 'qa_trig', datatypeKey: 'pick_list', datatypeOptions: { allowed_values: ['Normal', 'Escalate'] } },
    { fieldName: 'qa_rb', datatypeKey: 'radio_button', datatypeOptions: { allowed_values: ['R1', 'R2'] } },
    { fieldName: 'qa_st', datatypeKey: 'status', datatypeOptions: { allowed_values: ['New', 'Doing', 'Done'] } },
    { fieldName: 'qa_af', datatypeKey: 'single_line' },
    { fieldName: 'qa_af2', datatypeKey: 'single_line' },
    { fieldName: 'qa_num', datatypeKey: 'number' },
    { fieldName: 'qa_lk', datatypeKey: 'lookup', datatypeOptions: { target_module_id: OPEN, display_field: 'name', related_module: 'QA MF Types' } },
    { fieldName: 'qa_file', datatypeKey: 'file_upload', datatypeOptions: { allowed_extensions: ['pdf'], max_size_mb: 1 } },
    { fieldName: 'qa_img', datatypeKey: 'image_upload', datatypeOptions: { allowed_extensions: ['png'], max_size_mb: 1 } },
  ]);
  const u1 = await addFields(T.id, [{ fieldName: 'qa_uq', datatypeKey: 'single_line', unique: true }]); const u2 = await addFields(OPEN, [{ fieldName: 'qa_uq', datatypeKey: 'single_line', unique: true }]);
  const peer = async (mid, other) => { const f = (await fieldsOf(mid)).find(x => x.fieldName === 'qa_uq'); const b = { ...f, unique: true, uniquePeerModuleIds: [other] }; delete b.id; return await api('PUT', `/modules/${mid}/fields/${f.id}`, b); };
  const pa = await peer(T.id, OPEN), pb = await peer(OPEN, T.id); const f2 = { s: `${u1.s}/${u2.s}, peers ${pa.s}/${pb.s} ${pa.s >= 300 ? pa.t.slice(0, 150) : ''}`, t: '' };
  const all = ['qa_cb', 'qa_txt', 'qa_pl', 'qa_trig', 'qa_rb', 'qa_st', 'qa_af', 'qa_af2', 'qa_num', 'qa_lk', 'qa_uq', 'qa_file', 'qa_img'];
  const p = await placeOnLayout(T.id, L, all); const OL = (await defLayout(OPEN)).id; const p2 = await placeOnLayout(OPEN, OL, ['qa_uq']);
  rec('A1.setup', 'INFO', `module ${T.id}; fields → ${f1.s} ${f1.s >= 300 ? f1.t : ''}; Open qa_uq → ${f2.s} ${f2.s >= 300 ? f2.t : ''}; layouts → ${p.s}/${p2.s} ${p.s >= 300 ? p.t : ''}`, ctx);
});
// I19 / I24: a record made before the defaults exist, then defaults, then a record with no values
await step('I24', async () => {
  const old = await mkRec(T.id, { name: 'QA MF before defaults' }, L);
  const d = await placeOnLayout(T.id, L, [], { qa_cb: { defaultValue: true }, qa_txt: { defaultValue: 'QA default' }, qa_pl: { defaultValue: 'Beta' } });
  const lay = JSON.stringify(await getLayout(T.id, L)); const stored = (lay.match(/"defaultValue":[^,}]+/g) || []).join(' ');
  const nw = await mkRec(T.id, { name: 'QA MF after defaults' }, L); const nv = nw.id ? await getRec(T.id, nw.id) : {}; const ov = old.id ? await getRec(T.id, old.id) : {};
  const s = x => JSON.stringify({ cb: val(x.qa_cb), txt: val(x.qa_txt), pl: val(x.qa_pl) });
  rec('I24.api', 'INFO', `defaults saved in layout → ${d.s} (${stored}); new record via API with no values → ${nw.s} stored ${s(nv)}; record created before defaults now ${s(ov)}`, { ...ctx, oldId: old.id, newId: nw.id });
});
await step('I19', async () => {
  const a = await mkRec(T.id, { name: 'QA MF cb true', qa_cb: true }, L), b = await mkRec(T.id, { name: 'QA MF cb false', qa_cb: false }, L);
  const av = a.id ? val((await getRec(T.id, a.id)).qa_cb) : null, bv = b.id ? val((await getRec(T.id, b.id)).qa_cb) : null;
  rec('I19.api', 'INFO', `checkbox true → ${a.s} stored ${av}; false → ${b.s} stored ${bv} (explicit false must stay false even with default on)`);
});
await step('I23', async () => {
  const a = await mkRec(T.id, { name: 'QA MF radio', qa_rb: 'R2', qa_st: 'Doing' }, L); const g = a.id ? await getRec(T.id, a.id) : {};
  const bad = await mkRec(T.id, { name: 'QA MF radio bad', qa_rb: 'R9', qa_st: 'Nope' }, L);
  rec('I23.api', 'INFO', `radio R2 + status Doing → ${a.s} stored rb=${val(g.qa_rb)} st=${val(g.qa_st)}; invalid R9/Nope → ${bad.s} ${bad.err}`);
});
await step('I29', async () => {
  const d = await placeOnLayout(T.id, L, [], { qa_af: { autoFill: { source: 'current_user', key: 'name' } }, qa_af2: { autoFill: { source: 'record_field', key: 'qa_txt' } } });
  const a = await mkRec(T.id, { name: 'QA MF autofill empty', qa_txt: 'copy me' }, L); const av = a.id ? await getRec(T.id, a.id) : {};
  const b = await mkRec(T.id, { name: 'QA MF autofill manual', qa_af: 'manual value', qa_af2: 'manual 2', qa_txt: 'x' }, L); const bv = b.id ? await getRec(T.id, b.id) : {};
  let e = { s: '-' }; if (b.id) e = await api('PATCH', `/modules/${T.id}/records/${b.id}`, { data: [{ field: 'qa_txt', value: enc('changed') }] }); const ev = b.id ? await getRec(T.id, b.id) : {};
  rec('I29.api', 'INFO', `auto-fill config saved → ${d.s}; API create with qa_af empty → ${a.s}: af=${JSON.stringify(val(av.qa_af))} af2=${JSON.stringify(val(av.qa_af2))}; with manual values → af=${val(bv.qa_af)} af2=${val(bv.qa_af2)}; after editing qa_txt → af2=${val(ev.qa_af2)} (PATCH ${e.s})`, { autoId: a.id, manualId: b.id });
});
await step('I7', async () => {
  const a = await mkRec(T.id, { name: 'QA MF uq 1', qa_uq: 'QA-UQ-1' }, L);
  const same = await mkRec(T.id, { name: 'QA MF uq 2', qa_uq: 'QA-UQ-1' }, L);
  const other = await mkRec(OPEN, { name: 'QA MF uq open', qa_uq: 'QA-UQ-1' });
  const free = await mkRec(OPEN, { name: 'QA MF uq open2', qa_uq: 'QA-UQ-2' });
  const back = await mkRec(T.id, { name: 'QA MF uq 3', qa_uq: 'QA-UQ-2' }, L);
  const f = (await fieldsOf(T.id)).find(x => x.fieldName === 'qa_uq');
  rec('I7.api', 'INFO', `qa_uq unique, peers [QA MF Open] (stored peers ${JSON.stringify(f && f.uniquePeerModuleIds)}): first value → ${a.s}; same module duplicate → ${same.s} ${same.err}; same value in QA MF Open → ${other.s} ${other.err}; new value in Open → ${free.s}; that value back in Types → ${back.s} ${back.err}`);
});
await step('I36', async () => {
  const fr = await addFields(OPEN, [
    { fieldName: 'qa_cnt', datatypeKey: 'rollup_summary', datatypeOptions: { target_module_id: T.id, relation_field: 'qa_lk', target_field: 'qa_num', aggregation: 'count' } },
    { fieldName: 'qa_sum', datatypeKey: 'rollup_summary', datatypeOptions: { target_module_id: T.id, relation_field: 'qa_lk', target_field: 'qa_num', aggregation: 'sum' } }]);
  const OL = (await defLayout(OPEN)).id; await placeOnLayout(OPEN, OL, ['qa_cnt', 'qa_sum']);
  const P = await mkRec(OPEN, { name: 'QA MF rollup parent' });
  const c1 = await mkRec(T.id, { name: 'QA MF child 5', qa_lk: P.id, qa_num: 5 }, L), c2 = await mkRec(T.id, { name: 'QA MF child 7', qa_lk: P.id, qa_num: 7 }, L);
  await sleep(3000); const pv = P.id ? await getRec(OPEN, P.id) : {};
  const DM = 'e8845f1d-1153-4c9c-b3a8-a74b08e078dc';
  const nob = await addFields(DM, [{ fieldName: 'qa_bad_rollup', datatypeKey: 'rollup_summary', datatypeOptions: { target_module_id: T.id, relation_field: 'qa_lk', target_field: 'qa_num', aggregation: 'count' } }]);
  rec('I36.api', 'INFO', `rollup fields on Open → ${fr.s} ${fr.s >= 300 ? fr.t.slice(0, 200) : ''}; parent ${P.s}, children ${c1.s}/${c2.s} (${c1.err}); parent shows count=${JSON.stringify(val(pv.qa_cnt))} sum=${JSON.stringify(val(pv.qa_sum))} (expected 2 and 12); rollup on QA MF DeptMod over a lookup that does not point at it → ${nob.s} ${(nob.t || '').slice(0, 200)}`, { parentId: P.id });
});
await step('I3.skip', async () => rec('I3.api.prev', 'INFO', 'done in the first pass (550 fields)')); if (false) await step('I3', async () => {
  const LM = await mkModule('qa_mf_limit', 'QA MF Limit'); const LL = await initLayout(LM.id);
  const start = (await fieldsOf(LM.id)).length; let made = 0, stop = '';
  for (let b = 0; b < 11 && !stop; b++) {
    const defs = Array.from({ length: 50 }, (_, i) => ({ fieldName: `qa_bulk_${b * 50 + i}`, datatypeKey: 'single_line' }));
    const r = await addFields(LM.id, defs); if (r.s >= 300) stop = `batch ${b} → ${r.s} ${(r.t || '').slice(0, 200)}`; else made += 50;
  }
  const total = (await fieldsOf(LM.id)).length;
  // put all custom fields on the layout in one save
  const names = (await fieldsOf(LM.id)).filter(f => /^qa_bulk_/.test(f.fieldName)).map(f => f.fieldName); const p = await placeOnLayout(LM.id, LL, names);
  rec('I3.api', 'INFO', `QA MF Limit ${LM.id}: fields at start ${start}; created ${made} custom fields via API${stop ? '; stopped: ' + stop : ' (no refusal up to 550)'}; total now ${total}; placing all ${names.length} on the layout → ${p.s} ${p.s >= 300 ? (p.t || '').slice(0, 200) : ''}`, { limitModule: LM.id, limitLayout: LL });
});
return done();
