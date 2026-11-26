// Zoho: expression edit on existing records, pick-list rename, 1/0, empty handling. Unique labels. Deletes everything.
const S = 'Q' + Date.now().toString(36).slice(-4); const res = { suffix: S }; const M = { fields: [], leads: [] };
const fl = async () => (await zf('GET', '/crm/v8/settings/fields?module=Leads')).j.fields;
const mkField = async (label, def) => { const r = await zf('POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: label + ' ' + S, ...def }] }); const f0 = r.j?.fields?.[0]; if (f0?.details?.id) M.fields.push(f0.details.id); return { id: f0?.details?.id, code: f0?.code, msg: f0?.message }; };
const fx = (label, rt, expr, extra = {}) => mkField(label, { data_type: 'formula', formula: { return_type: rt, expression: expr, ...extra } });
const apiOf = async id => (await fl()).find(f => f.id === id)?.api_name;
const lead = async vals => { const r = await zf('POST', '/crm/v8/Leads', { data: [vals] }); const id = r.j?.data?.[0]?.details?.id; if (id) M.leads.push(id); else log('lead err', r.t.slice(0, 200)); return id; };
const get = async id => (await zf('GET', `/crm/v8/Leads/${id}`)).j?.data?.[0] || {};
const upd = async (id, vals) => (await zf('PUT', `/crm/v8/Leads/${id}`, { data: [vals] })).s;
const patchField = async (id, body) => { for (const [m, u] of [['PATCH', `/crm/v8/settings/fields?module=Leads`], ['PUT', `/crm/v8/settings/fields?module=Leads`], ['PATCH', `/crm/v6/settings/fields/${id}?module=Leads`], ['PUT', `/crm/v6/settings/fields/${id}?module=Leads`]]) {
  const r = await zf(m, u, { fields: [{ id, ...body }] }); if (r.s < 300) return m + ' ' + u.split('?')[0] + ' ' + r.s + ' ' + r.t.slice(0, 150); res['patchTry ' + m + ' ' + u.split('?')[0]] = r.s + ' ' + r.t.slice(0, 120); } return 'all failed'; };
try {
  const num = await mkField('QA FX D Num', { data_type: 'integer', length: 9 }); const num2 = await mkField('QA FX D Num2', { data_type: 'integer', length: 9 });
  const pick = await mkField('QA FX D Pick', { data_type: 'picklist', pick_list_values: [{ display_value: 'Red', actual_value: 'Red' }, { display_value: 'Green', actual_value: 'Green' }] });
  res.inputs = [num.code, num2.code, pick.code]; const NUM = await apiOf(num.id), NUM2 = await apiOf(num2.id), PICK = await apiOf(pick.id);
  const F1 = await fx('QA FX D F1', 'double', '${' + NUM + '}*2'); const F1A = await apiOf(F1.id);
  const F5 = await fx('QA FX D F5', 'text', "If(${" + PICK + "}=='Red','is red','other')"); const F5A = await apiOf(F5.id);
  const F9 = await fx('QA FX D F9', 'double', '1/0'); const F9A = await apiOf(F9.id);
  const F3 = await fx('QA FX D F3', 'double', 'Abs(${' + NUM2 + '})'); const F3A = await apiOf(F3.id);
  const F6 = await fx('QA FX D F6', 'double', '${' + NUM2 + '}+1'); const F6A = await apiOf(F6.id);
  const F7 = await fx('QA FX D F7', 'double', '${' + NUM2 + '}+1', { assume_default: true }); const F7A = await apiOf(F7.id);
  const L1 = await lead({ Last_Name: 'QA FX D1', [NUM]: 4, [PICK]: 'Red' }); await sleep(3000); let v = await get(L1);
  res.created = { F1: v[F1A], F5: v[F5A], 'F9 1/0': v[F9A] ?? null, 'Abs(empty)': v[F3A] ?? null, 'empty+1': v[F6A] ?? null, 'empty+1 assume_default': v[F7A] ?? null };
  // edit expression
  res.editExpr = await patchField(F1.id, { formula: { return_type: 'double', expression: '${' + NUM + '}*3' } }); await sleep(8000);
  res.afterEditExisting = (await get(L1))[F1A]; for (let i = 0; i < 6 && (await get(L1))[F1A] !== 12; i++) await sleep(10000); res.afterEdit60s = (await get(L1))[F1A];
  const L2 = await lead({ Last_Name: 'QA FX D2', [NUM]: 5 }); await sleep(2000); res.newRecordAfterEdit = (await get(L2))[F1A];
  // pick list rename
  const pf = (await zf('GET', `/crm/v8/settings/fields/${pick.id}?module=Leads`)).j?.fields?.[0]; const pv = pf?.pick_list_values || [];
  res.rename = await patchField(pick.id, { pick_list_values: pv.map(x => x.actual_value === 'Red' ? { id: x.id, display_value: 'Crimson', actual_value: 'Crimson' } : { id: x.id, display_value: x.display_value, actual_value: x.actual_value }) });
  await sleep(4000); const f5 = (await zf('GET', `/crm/v8/settings/fields/${F5.id}?module=Leads`)).j?.fields?.[0]?.formula; await upd(L1, { [NUM]: 6 }); await sleep(3000); v = await get(L1);
  res.afterRename = { pickOnRecord: v[PICK], formulaValue: v[F5A], formulaExpressionNow: f5?.expression };
} catch (e) { res.error = e.message; }
const cl = []; if (M.leads.length) cl.push('leads ' + (await zf('DELETE', `/crm/v8/Leads?ids=${M.leads.join(',')}`)).s);
for (const id of [...M.fields].reverse()) cl.push((await zf('DELETE', `/crm/v8/settings/fields/${id}?module=Leads`)).s);
res.cleanup = { calls: cl.join(','), left: (await fl()).filter(f => /^QA FX/i.test(f.field_label)).map(f => f.field_label) };
fs.writeFileSync(RUN + '/zoho/behaviour2.json', JSON.stringify(res, null, 1)); log(JSON.stringify(res, null, 1));
