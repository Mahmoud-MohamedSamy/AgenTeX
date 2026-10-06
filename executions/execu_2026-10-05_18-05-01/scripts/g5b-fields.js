// Group 5b — false-positive check: QA fields placed on the default layout + config set via PUT; validations re-run.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets'); const MID = QA.id;
const fields = async () => arr((await api('GET', `/modules/${MID}/fields`)).j.data);
const F = n => fields().then(a => a.find(x => x.fieldName === n));
const DEF = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).find(x => x.isDefault);
const enc = v => v === null || v === undefined || v === '' ? { kind: 'null' } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'string' ? { kind: 'string', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'object', properties: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) };
const recP = async (vals, noName) => { const r = await api('POST', `/modules/${MID}/records`, { data: [...(noName ? [] : [{ field: 'name', value: enc('QA MF rec L') }]), ...Object.entries(vals).map(([field, v]) => ({ field, value: enc(v) }))], layout_id: DEF.id }); return { s: r.s, err: ((r.j && r.j.error && (r.j.error.code + ' ' + (r.j.error.message || '') + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 120))) || '').slice(0, 220), data: r.j && r.j.data && r.j.data.data }; };
const ok = r => r.s >= 200 && r.s < 300;
// 1. config via PUT
const putCfg = async (n, cfg, opts) => { const f = await F(n); const body = { ...f, config: { ...(f.config || {}), ...cfg }, ...(opts ? { datatypeOptions: { ...(f.datatypeOptions || {}), ...opts } } : {}) }; const r = await api('PUT', `/modules/${MID}/fields/${f.id}`, body); const g = await F(n); return { s: r.s, err: ((r.j && r.j.error && r.j.error.message) || '').slice(0, 100), cfg: g.config }; };
const c1 = await putCfg('qa_rx', { regex: '^[A-Z]{2}[0-9]{4}$' });
const c2 = await putCfg('qa_req_ro', { read_only: true });
const c3 = await putCfg('qa_cur5', { currencySymbol: 'EGP12' });
const c4 = await putCfg('qa_rx_bad', { regex: '([' });
rec('I.cfg', 'INFO', `PUT regex → ${c1.s} config ${JSON.stringify(c1.cfg)}; PUT read_only on a required field → ${c2.s} ${c2.err} config ${JSON.stringify(c2.cfg)}; PUT currencySymbol "EGP12" → ${c3.s} config ${JSON.stringify(c3.cfg)}; PUT invalid regex "([" → ${c4.s} ${c4.err}`);
// 2. put all QA custom fields on the default layout CREATE view (second column of section 1)
const lay = (await api('GET', `/modules/${MID}/layouts/${DEF.id}`)).j.data;
const qaF = (await fields()).filter(x => x.isCustomField && x.status === 'active' && !['qa_lk_multi'].includes(x.fieldName));
for (const v of ['CREATE', 'DETAIL']) { const sec = lay.views[v].layout.sections[0]; const col = sec.columns[sec.columns.length - 1]; const have = new Set(sec.columns.flatMap(c => c.fields.map(f => f.id))); for (const f of qaF) if (!have.has(f.id)) col.fields.push(f); }
const body = { ...lay }; delete body.id;
const pr = await api('PUT', `/modules/${MID}/layouts/${DEF.id}`, body);
const onLay = arr((await api('GET', `/modules/${MID}/fields`)).j.data).filter(x => x.isCustomField && (x.layouts || []).length).length;
rec('I.layout', pr.s < 300 ? 'INFO' : 'BLOCKED', `PUT layout with ${qaF.length} QA fields → ${pr.s} ${pr.s >= 300 ? pr.t.slice(0, 160) : ''}; custom fields now on a layout: ${onLay}`);
// 3. re-run validations with layout_id
const T = [
  ['I4', 'required missing', { qa_sl10: 'x' }, false], ['I4', 'required given', { qa_req: 'v', qa_req_ro: 'v' }, true],
  ['I14', '11 chars on max_length 10', { qa_req: 'v', qa_req_ro: 'v', qa_sl10: 'x'.repeat(11) }, false],
  ['I16', 'number 101 on max 100', { qa_req: 'v', qa_req_ro: 'v', qa_num: 101 }, false], ['I16', 'number "abc"', { qa_req: 'v', qa_req_ro: 'v', qa_num: 'abc' }, false],
  ['I17', 'date "not a date"', { qa_req: 'v', qa_req_ro: 'v', qa_date: 'not a date' }, false], ['I17', 'date 2026-02-29', { qa_req: 'v', qa_req_ro: 'v', qa_date: '2026-02-29' }, false],
  ['I18', 'email "not-an-email"', { qa_req: 'v', qa_req_ro: 'v', qa_email: 'not-an-email' }, false], ['I18', 'url javascript:', { qa_req: 'v', qa_req_ro: 'v', qa_url: 'javascript:alert(1)' }, false],
  ['I20', 'pick list "Delta" not in list', { qa_req: 'v', qa_req_ro: 'v', qa_pl: 'Delta' }, false],
  ['I22', 'multi-select 3 values (max 2)', { qa_req: 'v', qa_req_ro: 'v', qa_ms: ['A', 'B', 'C'] }, false],
  ['I25', 'regex "ab12"', { qa_req: 'v', qa_req_ro: 'v', qa_rx: 'ab12' }, false], ['I25', 'regex "AB1234"', { qa_req: 'v', qa_req_ro: 'v', qa_rx: 'AB1234' }, true],
  ['I39', 'address object', { qa_req: 'v', qa_req_ro: 'v', qa_addr: { street: '1 Nile St', city: 'Cairo', country: 'Egypt' } }, true],
  ['F9', 'record with no name', { qa_req: 'v', qa_req_ro: 'v' }, false, true]
];
const by = {};
for (const [id, label, vals, expectOk, noName] of T) { const r = await recP(vals, noName); const pass = expectOk ? ok(r) : !ok(r); (by[id] = by[id] || []).push(`${label} → ${r.s}${!ok(r) ? ' ' + r.err.slice(0, 90) : ''} ${pass ? '✓' : '✗'}`); }
for (const [id, arr2] of Object.entries(by)) rec(id + '.onLayout', arr2.every(x => x.endsWith('✓')) ? 'PASS' : 'FAIL', 'record saves with layout_id = default layout and the field on that layout: ' + arr2.join(' ; '));
// 4. lookup options stored
const lk = await F('qa_lk'), lk2 = await F('qa_lk2'), lkm = await F('qa_lk_multi');
rec('I32.detail', 'INFO', `qa_lk options ${JSON.stringify(lk && lk.datatypeOptions)}; qa_lk2 ${JSON.stringify(lk2 && lk2.datatypeOptions)}; qa_lk_multi ${JSON.stringify(lkm && lkm.datatypeOptions)}`);
// 5. rich text render check
const rts = arr((await api('GET', `/modules/${MID}/records?page_size=100`)).j.data);
let rtId = null; for (const r of rts) { const g = (await api('GET', `/modules/${MID}/records/${r.id}`)).j; if (JSON.stringify(g).includes('<script>alert(1)')) { rtId = r.id; break; } }
const alerts = []; const onD = d => { alerts.push(d.message()); d.dismiss().catch(() => { }); }; page.on('dialog', onD);
if (rtId) { await go(`/modules/${MID}/records/${rtId}`, 8000); }
const dom = await page.evaluate(() => ({ scripts: [...document.querySelectorAll('main script, [class*=prose] script')].length, onerr: document.querySelectorAll('img[onerror]').length, imgx: document.querySelectorAll('img[src="x"]').length }));
const s = await shot('I40-rich-text-record');
page.off('dialog', onD);
rec('I40.render', alerts.length || dom.onerr ? 'FAIL' : 'PASS', `record detail with stored <script>/<img onerror>: alert dialogs ${alerts.length}; <script> nodes in content ${dom.scripts}; img[onerror] ${dom.onerr}; img[src=x] ${dom.imgx}`, { shot: s });
return done();
