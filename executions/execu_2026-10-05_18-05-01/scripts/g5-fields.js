// Group 5 — fields on QA MF Devices via the same API the builder uses; validation checked through record saves.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const MID = QA.id;
const fields = async () => arr((await api('GET', `/modules/${MID}/fields`)).j.data);
const mkF = async (fieldName, label, datatypeKey, datatypeOptions, config) => {
  const r = await api('POST', `/modules/${MID}/fields`, { fields: [{ fieldName, labels: typeof label === 'string' ? { en: label } : label, datatypeKey, required: !!(config && config.required), unique: !!(config && config.unique), uniquePeerModuleIds: [], ...(datatypeOptions ? { datatypeOptions } : {}), ...(config ? { config } : {}) }] });
  const f = (await fields()).find(x => x.fieldName === fieldName || x.apiName === fieldName);
  return { s: r.s, err: ((r.j && r.j.error && (r.j.error.code + ' ' + r.j.error.message)) || '').slice(0, 140), f };
};
const enc = v => v === null || v === undefined || v === '' ? { kind: 'null' } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'string' ? { kind: 'string', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'object', fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) };
const made = [];
const recP = async (vals) => { const r = await api('POST', `/modules/${MID}/records`, { data: [{ field: 'name', value: enc('QA MF rec ' + Date.now() % 100000) }, ...Object.entries(vals).map(([field, v]) => ({ field, value: enc(v) }))] }); const id = r.j && r.j.data && r.j.data.id; if (id) made.push(id); return { s: r.s, id, err: ((r.j && r.j.error && (r.j.error.code + ' ' + r.j.error.message)) || '').slice(0, 120), data: r.j && r.j.data && r.j.data.data }; };
const val = (d, f) => { const x = (d || []).find(y => y.field === f); return x ? JSON.stringify(x.value) : 'absent'; };
const ok = r => r.s >= 200 && r.s < 300;

await step('I11', async () => {
  const a = await mkF('qa_lbl51', 'Q'.repeat(51), 'single_line'); const b = await mkF('qa_lbl_ar', { en: 'QA MF Label', ar: 'حقل QA', fr: 'Champ QA' }, 'single_line'); const c = await mkF('qa_lbl_html', 'QA MF <img src=x onerror=alert(1)>', 'single_line');
  rec('I11', !a.f && b.f && b.f.labels.ar ? 'PASS' : 'FAIL', `51-char label → ${a.s} ${a.f ? 'CREATED' : a.err}; EN/AR/FR label → ${b.s} stored ${JSON.stringify(b.f && b.f.labels)}; html label → ${c.s} stored ${JSON.stringify(c.f && c.f.labels.en)}`);
});
await step('I12', async () => {
  const out = [];
  for (const k of ['1abc', 'a-b', 'a b', 'ابجد', 'Single_Line']) { const r = await mkF(k, 'QA MF api ' + k, 'single_line'); out.push(`"${k}" → ${r.s} ${r.f && r.f.fieldName === k ? 'CREATED' : r.err.slice(0, 60)}`); }
  rec('I12', out.some(o => /CREATED/.test(o)) ? 'FAIL' : 'PASS', out.join(' ; '));
});
await step('I13', async () => {
  const f = (await fields()).find(x => x.fieldName === 'qa_lbl_ar');
  const r = await api('PUT', `/modules/${MID}/fields/${f.id}`, { ...f, datatypeKey: 'number' }); const g = (await fields()).find(x => x.id === f.id);
  rec('I13', g.datatypeKey === 'single_line' ? 'PASS' : 'FAIL', `PUT datatypeKey single_line→number → ${r.s}; stored type ${g.datatypeKey}`);
});
await step('I14', async () => {
  const f = await mkF('qa_sl10', 'QA MF SL10', 'single_line', { max_length: 10 }); const big = await mkF('qa_sl_big', 'QA MF SLbig', 'single_line', { max_length: 20001 });
  const r1 = await recP({ qa_sl10: 'x'.repeat(10) }), r2 = await recP({ qa_sl10: 'x'.repeat(11) });
  rec('I14', f.f && !big.f && ok(r1) && !ok(r2) ? 'PASS' : 'FAIL', `field max_length 10 → ${f.s}; max_length 20001 → ${big.s} ${big.f ? 'CREATED' : big.err}; record 10 chars → ${r1.s}; 11 chars → ${r2.s} ${r2.err}`);
});
await step('I15', async () => {
  const big = await mkF('qa_ml_big', 'QA MF MLbig', 'multi_line', { max_length: 100001 }); const okf = await mkF('qa_ml', 'QA MF ML', 'multi_line', { max_length: 100000 });
  rec('I15', okf.f && !big.f ? 'PASS' : 'FAIL', `multi_line max_length 100000 → ${okf.s}; 100001 → ${big.s} ${big.f ? 'CREATED' : big.err}`);
});
await step('I16', async () => {
  await mkF('qa_num', 'QA MF Num', 'number', { min: 0, max: 100 }); await mkF('qa_dec', 'QA MF Dec', 'decimal', { precision: 6, scale: 2 }); const cur = await mkF('qa_cur5', 'QA MF Cur', 'currency', { scale: 2 }, { currencySymbol: 'EGP12' });
  const t = [['num 50', { qa_num: 50 }], ['num 101', { qa_num: 101 }], ['num -1', { qa_num: -1 }], ['num "abc"', { qa_num: 'abc' }], ['num "15,000"', { qa_num: '15,000' }], ['dec 1.236', { qa_dec: 1.236 }], ['dec 1e9', { qa_dec: 1e9 }]];
  const out = []; for (const [n, v] of t) { const r = await recP(v); out.push(`${n} → ${r.s}${ok(r) ? ' stored ' + val(r.data, Object.keys(v)[0]) : ''}`); }
  const bad = out.some(o => /(num 101|num -1|num "abc"|num "15,000") → 20/.test(o));
  rec('I16', bad ? 'FAIL' : 'PASS', out.join(' ; ') + `; currency symbol "EGP12" (5 chars, UI max 4) → field ${cur.s} stored ${JSON.stringify(cur.f && cur.f.config && cur.f.config.currencySymbol)}`);
});
await step('I17', async () => {
  await mkF('qa_date', 'QA MF Date', 'date'); await mkF('qa_dt', 'QA MF DateTime', 'date_time');
  const out = []; for (const [n, v] of [['2026-02-29', { qa_date: '2026-02-29' }], ['2028-02-29', { qa_date: '2028-02-29' }], ['"not a date"', { qa_date: 'not a date' }], ['dt ISO', { qa_dt: '2026-10-06T21:59:00Z' }], ['dt garbage', { qa_dt: 'yesterday' }]]) { const r = await recP(v); out.push(`${n} → ${r.s}${ok(r) ? ' stored ' + val(r.data, Object.keys(v)[0]) : ''}`); }
  rec('I17', /2026-02-29 → 20|not a date" → 20|garbage → 20/.test(out.join(';')) ? 'FAIL' : 'PASS', out.join(' ; '));
});
await step('I18', async () => {
  await mkF('qa_email', 'QA MF Email', 'email'); await mkF('qa_phone', 'QA MF Phone', 'phone'); await mkF('qa_url', 'QA MF URL', 'url');
  const out = []; for (const [n, v] of [['email ok', { qa_email: 'qa.tester@example.com' }], ['email bad', { qa_email: 'not-an-email' }], ['phone letters', { qa_phone: 'call me' }], ['url ok', { qa_url: 'https://example.com' }], ['url javascript:', { qa_url: 'javascript:alert(1)' }]]) { const r = await recP(v); out.push(`${n} → ${r.s}${r.err ? ' ' + r.err.slice(0, 50) : ''}`); }
  rec('I18', /email bad → 20|javascript: → 20/.test(out.join(';')) ? 'FAIL' : 'PASS', out.join(' ; '));
});
await step('I20', async () => {
  const dup = await mkF('qa_pl_dup', 'QA MF PL dup', 'pick_list', { allowed_values: ['A', 'A'] });
  const pl = await mkF('qa_pl', 'QA MF PL', 'pick_list', { allowed_values: ['Alpha', 'بيتا', '<b>Gamma</b>'] });
  const r1 = await recP({ qa_pl: 'Alpha' }), r2 = await recP({ qa_pl: 'Delta' });
  rec('I20', !dup.f && pl.f && ok(r1) && !ok(r2) ? 'PASS' : 'FAIL', `duplicate options ["A","A"] → ${dup.s} ${dup.f ? 'CREATED with ' + JSON.stringify(dup.f.datatypeOptions.allowed_values) : dup.err}; Arabic/html options stored ${JSON.stringify(pl.f && pl.f.datatypeOptions.allowed_values)}; record "Alpha" → ${r1.s}; value not in list "Delta" → ${r2.s} ${r2.err}`);
});
await step('I22', async () => {
  await mkF('qa_ms', 'QA MF MS', 'multi_select', { allowed_values: ['A', 'B', 'C'], max_items: 2 });
  const r1 = await recP({ qa_ms: ['A', 'B'] }), r2 = await recP({ qa_ms: ['A', 'B', 'C'] });
  rec('I22', ok(r1) && !ok(r2) ? 'PASS' : 'FAIL', `multi-select max_items 2: 2 values → ${r1.s}; 3 values → ${r2.s} ${r2.err}`);
});
await step('I4', async () => {
  await mkF('qa_req', 'QA MF Required', 'single_line', null, { required: true });
  const r1 = await recP({}), r2 = await recP({ qa_req: 'filled' });
  rec('I4', !ok(r1) && ok(r2) ? 'PASS' : 'FAIL', `required field: record without it → ${r1.s} ${r1.err}; with it → ${r2.s}`, { severity: 'High' });
});
await step('I5', async () => {
  const r = await mkF('qa_req_ro', 'QA MF Req RO', 'single_line', null, { required: true, read_only: true });
  rec('I5', !r.f ? 'PASS' : 'FAIL', `field with required + read_only → ${r.s} ${r.f ? 'CREATED (config ' + JSON.stringify(r.f.config) + ')' : r.err}`);
});
await step('I6', async () => {
  await mkF('qa_uniq', 'QA MF Unique', 'single_line', null, { unique: true });
  const a = await recP({ qa_uniq: 'abc' }), b = await recP({ qa_uniq: 'abc' }), c = await recP({ qa_uniq: 'ABC' }), d = await recP({ qa_uniq: ' abc ' });
  rec('I6', ok(a) && !ok(b) ? 'PASS' : 'FAIL', `unique: "abc" → ${a.s}; "abc" again → ${b.s} ${b.err}; "ABC" → ${c.s}; " abc " → ${d.s}`);
});
await step('I25', async () => {
  const f = await mkF('qa_rx', 'QA MF Regex', 'single_line', null, { regex: '^[A-Z]{2}[0-9]{4}$' });
  const a = await recP({ qa_rx: 'AB1234' }), b = await recP({ qa_rx: 'ab12' });
  const bad = await mkF('qa_rx_bad', 'QA MF Regex bad', 'single_line', null, { regex: '([' });
  rec('I25', ok(a) && !ok(b) && !bad.f ? 'PASS' : 'FAIL', `regex stored ${JSON.stringify(f.f && f.f.config && f.f.config.regex)}; "AB1234" → ${a.s}; "ab12" → ${b.s} ${b.err}; invalid regex "([" → ${bad.s} ${bad.f ? 'CREATED' : bad.err}`);
  const rd = await mkF('qa_redos', 'QA MF ReDoS', 'single_line', null, { regex: '(a+)+$' });
  const t0 = Date.now(); const r = await recP({ qa_redos: 'a'.repeat(32) + 'b' }); const ms = Date.now() - t0;
  rec('I26', ms < 2000 ? 'PASS' : 'FAIL', `regex (a+)+$ with 32×"a"+"b" → ${r.s} in ${ms} ms`);
});
await step('I30', async () => {
  const f = await mkF('qa_auto', 'QA MF Auto', 'auto_number', { prefix: 'QA-', suffix: '-EG', start_number: 7, padding: 4, increment: 2 });
  const vals = []; for (let i = 0; i < 2; i++) { const r = await recP({}); vals.push(val(r.data, 'qa_auto')); }
  const par = await Promise.all([1, 2, 3, 4, 5].map(() => recP({}))); const pv = par.map(r => val(r.data, 'qa_auto'));
  const all = [...vals, ...pv]; const uniq = new Set(all).size === all.length;
  rec('I30', f.f && /QA-0007-EG/.test(vals[0]) && /QA-0009-EG/.test(vals[1]) && uniq ? 'PASS' : 'FAIL', `auto number field → ${f.s}; first two records: ${vals.join(', ')}; 5 parallel creates: ${pv.join(', ')}; all unique=${uniq}`);
  const b1 = await mkF('qa_auto_b1', 'QA MF Auto b1', 'auto_number', { padding: 13 }); const b2 = await mkF('qa_auto_b2', 'QA MF Auto b2', 'auto_number', { increment: 0 });
  rec('I31', !b1.f && !b2.f ? 'PASS' : 'FAIL', `padding 13 → ${b1.s} ${b1.f ? 'CREATED' : b1.err}; increment 0 → ${b2.s} ${b2.f ? 'CREATED' : b2.err}`);
});
await step('I32', async () => {
  const a = await mkF('qa_lk', 'QA MF Contact', 'lookup', { target_module_id: M.contacts, display_field: 'first_name', related_list_title: 'QA MF Devices' });
  const b = await mkF('qa_lk2', 'QA MF Contact 2', 'lookup', { target_module_id: M.contacts, display_field: 'first_name', related_list_title: 'QA MF Devices' });
  const rel = await api('GET', `/modules/${M.contacts}/related-modules`); const shown = (rel.t || '').includes('qa_lk');
  rec('I32', a.f && !b.f ? 'PASS' : 'FAIL', `lookup to Contacts → ${a.s}; second lookup with the same related-list title → ${b.s} ${b.f ? 'CREATED' : b.err}; Contacts related-modules lists it: ${shown}`);
  const c = await mkF('qa_lk_multi', 'QA MF Multi', 'lookup', { target_modules: [] });
  rec('I33', !c.f ? 'PASS' : 'FAIL', `multi-module lookup with no modules → ${c.s} ${c.f ? 'CREATED' : c.err}`);
});
await step('I34', async () => {
  const f = await mkF('qa_fx', 'QA MF Formula', 'formula', { expression: 'upper(name)', return_kind: 'string' }, { expression: 'upper(name)' });
  const r = await recP({}); const e = await mkF('qa_fx_empty', 'QA MF Fx empty', 'formula', { expression: '' }, { expression: '' }); const u = await mkF('qa_fx_bad', 'QA MF Fx bad', 'formula', { expression: 'no_such_field * 2' }, { expression: 'no_such_field * 2' });
  rec('I34', f.f && /QA MF REC/.test(val(r.data, 'qa_fx')) && !e.f ? 'PASS' : 'FAIL', `formula upper(name) → ${f.s}; computed value on save: ${val(r.data, 'qa_fx')}; empty expression → ${e.s} ${e.f ? 'CREATED' : e.err}; unknown field in expression → ${u.s} ${u.f ? 'CREATED' : u.err}`);
});
await step('I35', async () => {
  const z = await mkF('qa_sub0', 'QA MF Sub0', 'subform', { subfields: [] }); const s = await mkF('qa_sub', 'QA MF Sub', 'subform', { subfields: [{ key: 'c1', label: 'Col 1', datatype: 'single_line' }] });
  rec('I35', !z.f && s.f ? 'PASS' : 'FAIL', `subform with 0 columns → ${z.s} ${z.f ? 'CREATED' : z.err}; with 1 column → ${s.s}`);
});
await step('I39', async () => {
  await mkF('qa_addr', 'QA MF Address', 'address');
  const r = await recP({ qa_addr: { street: '1 Nile St', city: 'Cairo', country: 'Egypt' } });
  rec('I39', ok(r) ? 'PASS' : 'FAIL', `address record → ${r.s}; stored ${val(r.data, 'qa_addr').slice(0, 120)}`);
});
await step('I40', async () => {
  await mkF('qa_rt', 'QA MF Rich', 'rich_text');
  const r = await recP({ qa_rt: '<p>ok</p><script>alert(1)</script><img src=x onerror=alert(2)>' }); const v = val(r.data, 'qa_rt');
  rec('I40', ok(r) && !/<script|onerror/i.test(v) ? 'PASS' : (ok(r) ? 'FAIL' : 'INFO'), `rich text with <script> and onerror → ${r.s}; stored ${v.slice(0, 160)}`);
});
await step('I42', async () => {
  const f = (await fields()).find(x => x.fieldName === 'qa_lbl_ar');
  const d = await api('DELETE', `/modules/${MID}/fields/${f.id}`); const g = (await fields()).find(x => x.id === f.id);
  rec('I42', d.s < 300 && (!g || g.status !== 'active') ? 'PASS' : 'FAIL', `DELETE unused QA field → ${d.s} ${d.s >= 300 ? d.t.slice(0, 120) : ''}; field now ${g ? g.status : 'gone'}`);
});
rec('I.created', 'INFO', `QA fields now: ${(await fields()).filter(x => x.isCustomField).map(x => x.fieldName).join(', ')}; QA records created: ${made.length}`);
return done();
