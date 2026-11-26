// Zoho behaviour checks (to compare with TAVI). Everything created is deleted at the end. Out: zoho/behaviour.json
const res = {}; const M = { fields: [], leads: [] }; const save = () => fs.writeFileSync(RUN + '/zoho/behaviour-made.json', JSON.stringify(M, null, 1));
const fl = async () => (await zf('GET', '/crm/v8/settings/fields?module=Leads')).j.fields;
const mkField = async (label, def) => { const r = await zf('POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: label, ...def }] }); const f0 = r.j?.fields?.[0]; if (f0?.details?.id) { M.fields.push(f0.details.id); save(); } return { id: f0?.details?.id, code: f0?.code, msg: f0?.message, s: r.s }; };
const fx = (label, rt, expr, extra = {}) => mkField(label, { data_type: 'formula', formula: { return_type: rt, expression: expr, ...extra } });
const apiOf = async id => (await fl()).find(f => f.id === id)?.api_name;
const lead = async (vals) => { const r = await zf('POST', '/crm/v8/Leads', { data: [vals] }); const id = r.j?.data?.[0]?.details?.id; if (id) { M.leads.push(id); save(); } else log('lead err', r.t.slice(0, 300)); return id; };
const get = async id => (await zf('GET', `/crm/v8/Leads/${id}`)).j?.data?.[0] || {};
const upd = async (id, vals) => (await zf('PUT', `/crm/v8/Leads/${id}`, { data: [vals] })).s;
try {
  const num = await mkField('QA FX C Num', { data_type: 'integer', length: 9 }); const num2 = await mkField('QA FX C Num2', { data_type: 'integer', length: 9 });
  const pick = await mkField('QA FX C Pick', { data_type: 'picklist', pick_list_values: [{ display_value: 'Red', actual_value: 'Red' }, { display_value: 'Green', actual_value: 'Green' }] });
  const NUM = await apiOf(num.id), NUM2 = await apiOf(num2.id), PICK = await apiOf(pick.id); res.inputs = { NUM, NUM2, PICK };
  // A. existing record when a formula is added
  const L1 = await lead({ Last_Name: 'QA FX C1', [NUM]: 4, [PICK]: 'Red' });
  const F1 = await fx('QA FX C F1', 'double', '${' + NUM + '}*2'); const F1A = await apiOf(F1.id); await sleep(4000);
  res.A_addFormula_existingRecord = { created: F1.code, valueOnExistingRecord: (await get(L1))[F1A] ?? null, note: 'TAVI: existing records stay empty (NDC-3219)' };
  const L2 = await lead({ Last_Name: 'QA FX C2', [NUM]: 5, [PICK]: 'Green' }); await sleep(2000); res.A_newRecord = (await get(L2))[F1A];
  // B. edit expression -> existing records?
  const e = await zf('PUT', `/crm/v8/settings/fields/${F1.id}?module=Leads`, { fields: [{ formula: { return_type: 'double', expression: '${' + NUM + '}*3' } }] }); res.B_editExpression = { s: e.s, resp: e.t.slice(0, 200) };
  await sleep(6000); res.B_afterEdit = { L1: (await get(L1))[F1A], L2: (await get(L2))[F1A], expected: { L1: 12, L2: 15 }, note: 'TAVI: old values kept until the record is saved again (NDC-3219)' };
  for (let i = 0; i < 6 && (await get(L1))[F1A] !== 12; i++) await sleep(10000); res.B_afterWait60s = { L1: (await get(L1))[F1A], L2: (await get(L2))[F1A] };
  // C. formula reading a formula
  const F2 = await fx('QA FX C F2', 'double', '${' + F1A + '}+1'); res.C_formulaOnFormula = { code: F2.code, msg: F2.msg, note: 'TAVI refuses (DATATYPE_FORMULA_CHAIN_UNSUPPORTED, gap NDC-3229)' };
  if (F2.id) { const F2A = await apiOf(F2.id); await upd(L2, { [NUM]: 6 }); await sleep(3000); const v = await get(L2); res.C_values = { num: v[NUM], F1: v[F1A], F2: v[F2A], expected: { F1: 18, F2: 19 } }; }
  // D. record edit recalculates
  await upd(L1, { [NUM]: 10 }); await sleep(3000); res.D_editRecord = { F1: (await get(L1))[F1A], expected: 30 };
  // E. empty input handling + "assume default" option
  const F3 = await fx('QA FX C F3', 'double', 'Abs(${' + NUM2 + '})+1'); const F3A = await apiOf(F3.id);
  const fdef = (await zf('GET', `/crm/v8/settings/fields/${F3.id}?module=Leads`)).j?.fields?.[0]; res.E_formulaProps = fdef?.formula;
  const F4 = await fx('QA FX C F4', 'double', 'Abs(${' + NUM2 + '})+1', { assume_default: true }); const F4A = F4.id ? await apiOf(F4.id) : null; res.E_assumeDefaultCreate = F4.code + ' ' + (F4.msg || '');
  if (!F4.id) { const F4b = await fx('QA FX C F4', 'double', 'Abs(${' + NUM2 + '})+1'); if (F4b.id) { const p = await zf('PUT', `/crm/v8/settings/fields/${F4b.id}?module=Leads`, { fields: [{ formula: { return_type: 'double', expression: 'Abs(${' + NUM2 + '})+1', assume_default: true } }] }); res.E_assumeDefaultEdit = p.t.slice(0, 200); } }
  await upd(L1, { [NUM]: 11 }); await sleep(3000); const v1 = await get(L1); const f4api = F4A || (await fl()).find(f => f.field_label === 'QA FX C F4')?.api_name;
  res.E_emptyInput = { 'Abs(empty)+1 default': v1[F3A] ?? null, 'Abs(empty)+1 assume_default': v1[f4api] ?? null, F4props: (await zf('GET', `/crm/v8/settings/fields/${(await fl()).find(f => f.field_label === 'QA FX C F4')?.id}?module=Leads`)).j?.fields?.[0]?.formula, note: 'TAVI: empty counts as 0 → 1' };
  // F. pick list option rename used in a formula
  const F5 = await fx('QA FX C F5', 'text', "If(${" + PICK + "}=='Red','is red','other')"); const F5A = await apiOf(F5.id); await upd(L1, { [NUM]: 12 }); await sleep(2000); res.F_before = (await get(L1))[F5A];
  const pf = (await zf('GET', `/crm/v8/settings/fields/${pick.id}?module=Leads`)).j?.fields?.[0]; const pv = pf?.pick_list_values || [];
  const rn = await zf('PUT', `/crm/v8/settings/fields/${pick.id}?module=Leads`, { fields: [{ pick_list_values: pv.map(x => x.actual_value === 'Red' ? { id: x.id, display_value: 'Crimson', actual_value: 'Crimson' } : { id: x.id, display_value: x.display_value, actual_value: x.actual_value }) }] });
  res.F_rename = { s: rn.s, resp: rn.t.slice(0, 250) }; await sleep(3000); const fx5 = (await zf('GET', `/crm/v8/settings/fields/${F5.id}?module=Leads`)).j?.fields?.[0]?.formula; await upd(L1, { [NUM]: 13 }); await sleep(2000);
  res.F_after = { pick: (await get(L1))[PICK], formula: (await get(L1))[F5A], expression: fx5?.expression, note: 'TAVI: formula keeps "Red", silently gives "other" (NDC-3227)' };
  // G. delete a field used by a formula
  const dn = await zf('DELETE', `/crm/v8/settings/fields/${num.id}?module=Leads`); res.G_deleteUsedField = { s: dn.s, resp: dn.t.slice(0, 400), note: 'TAVI: deleted with 204, formula breaks silently (NDC-3218)' };
  if (dn.s < 300) M.fields = M.fields.filter(i => i !== num.id);
  // H. error messages
  const H = {}; for (const [k, rt, ex] of [['unknown field', 'double', '${Nope_Field}*2'], ['unknown function', 'double', 'Foo(1)'], ['wrong argument type', 'text', 'Upper(${' + NUM2 + '})'], ['missing bracket', 'double', 'Abs(1'], ['return type mismatch', 'boolean', 'Abs(1)'], ['empty expression', 'double', ''], ['divide by zero', 'double', '1/0'], ['self reference', 'double', '${QA_FX_C_F6}+1']]) {
    const r = await fx('QA FX C H ' + k, rt, ex); H[k] = (r.code || r.s) + ': ' + (r.msg || ''); }
  res.H_messages = H;
  // I. limits
  const L = {}; const long = n => Array(n).fill('1').join('+'); for (const n of [700, 1001, 2500]) { const ex = long(n); const r = await fx('QA FX C L' + n, 'double', ex); L['length ' + ex.length] = (r.code || r.s) + ' ' + (r.msg || ''); }
  for (const d of [10, 20, 33]) { const ex = 'Abs('.repeat(d) + '1' + ')'.repeat(d); const r = await fx('QA FX C N' + d, 'double', ex); L['nesting ' + d] = (r.code || r.s) + ' ' + (r.msg || ''); }
  res.I_limits = L;
} catch (e) { res.error = e.message; }
// cleanup
const cl = []; if (M.leads.length) cl.push('leads ' + (await zf('DELETE', `/crm/v8/Leads?ids=${M.leads.join(',')}`)).s);
for (const id of [...M.fields].reverse()) cl.push((await zf('DELETE', `/crm/v8/settings/fields/${id}?module=Leads`)).s);
const left = (await fl()).filter(f => /^QA FX/i.test(f.field_label)).map(f => f.field_label); for (const lb of left) { const f = (await fl()).find(x => x.field_label === lb); if (f) cl.push(lb + ' ' + (await zf('DELETE', `/crm/v8/settings/fields/${f.id}?module=Leads`)).s); }
res.cleanup = { calls: cl.join(','), left: (await fl()).filter(f => /^QA FX/i.test(f.field_label)).map(f => f.field_label) };
fs.writeFileSync(RUN + '/zoho/behaviour.json', JSON.stringify(res, null, 1)); log(JSON.stringify(res, null, 1));
