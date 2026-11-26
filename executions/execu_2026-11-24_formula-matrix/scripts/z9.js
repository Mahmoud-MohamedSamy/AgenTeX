// Zoho pair test: TAVI function/operator (Zoho equivalent) × Zoho input type → accepted? value on a filled and an empty lead. Cleans up as it goes.
const made = JSON.parse(fs.readFileSync(RUN + '/zoho/made.json', 'utf8')); const IN = made.inputs; const save = () => fs.writeFileSync(RUN + '/zoho/made.json', JSON.stringify(made, null, 1));
const X = t => '${' + IN[t].api + '}'; const DATE = '${' + IN.date.api + '}', DT = '${' + IN.date_time.api + '}';
const FZ = [
  ['if', 'text', x => `If(IsEmpty(${x}),'empty','set')`], ['concat', 'text', x => `Concat('[',${x},']')`], ['coalesce', 'text', null], ['min', 'double', x => `Min(${x},100)`], ['max', 'double', x => `Max(${x},0)`],
  ['sum', 'double', null], ['avg', 'double', null], ['count', 'double', null], ['upper', 'text', x => `Upper(${x})`], ['lower', 'text', x => `Lower(${x})`], ['trim', 'text', x => `Trim(${x})`], ['len', 'double', x => `Len(${x})`],
  ['abs', 'double', x => `Abs(${x})`], ['round', 'double', x => `Round(${x},1)`], ['isblank', 'boolean', x => `IsEmpty(${x})`], ['number', 'double', x => `Tonumber(${x})`], ['text', 'text', x => `Tostring(${x})`],
  ['daysbetween', 'double', x => `Datecomp(${DATE},${x})/1440`], ['hoursbetween', 'double', x => `Datecomp(${DT},${x})/60`],
  ['op_add', 'double', x => `${x}+1`], ['op_sub', 'double', x => `${x}-1`], ['op_mul', 'double', x => `${x}*2`], ['op_div', 'double', x => `${x}/2`], ['op_mod', 'double', x => `${x}%3`], ['op_plus_text', 'text', x => `${x}+'!'`],
  ['op_eq', 'boolean', x => `${x}==${x}`], ['op_ne', 'boolean', x => `${x}!=${x}`], ['op_gt', 'boolean', x => `${x}>${x}`], ['op_ge', 'boolean', x => `${x}>=${x}`], ['op_lt', 'boolean', x => `${x}<${x}`], ['op_le', 'boolean', x => `${x}<=${x}`],
  ['op_and', 'boolean', x => `${x}&&true`], ['op_or', 'boolean', x => `${x}||false`], ['op_not', 'boolean', x => `!${x}`],
];
const ALT = { text: ['double', 'boolean', 'datetime', 'date'], double: ['text'], boolean: ['text'] };
const res = fs.existsSync(RUN + '/zoho/pairs.json') ? JSON.parse(fs.readFileSync(RUN + '/zoho/pairs.json', 'utf8')) : {}; const saveRes = () => fs.writeFileSync(RUN + '/zoho/pairs.json', JSON.stringify(res, null, 1));
// test record inputs
if (!made.acc) { const r = await zf('POST', '/crm/v8/Accounts', { data: [{ Account_Name: 'QA FX Matrix Acc' }] }); made.acc = r.j?.data?.[0]?.details?.id; save(); }
if (!made.me) { const r = await zf('GET', '/crm/v8/users?type=CurrentUser'); made.me = r.j?.users?.[0]?.id; save(); }
const FULL = { single_line: '  Hello World  ', multi_line: 'Line one\nLine two', rich_text: '<p><b>Bold</b> text</p>', email: 'Qa.Fx@Example.com', phone: '+20 100 123 4567', url: 'https://example.com/Path', number: -42, decimal: 3.14159, currency: 1234.5, percent: 12.5, long_integer: '9007199254740', checkbox: true,
  pick_list: 'Green', multi_select: ['A', 'C'], date: '2026-11-24', date_time: '2026-11-24T23:30:00+02:00', lookup: made.acc ? { id: made.acc } : undefined, user: made.me ? { id: made.me } : undefined };
const recData = (vals, name) => { const o = { Last_Name: name }; for (const [t, v] of Object.entries(vals)) if (v !== undefined && IN[t]) o[IN[t].api] = v; return o; };
let batch = []; // {key, id, api}
const flush = async () => { if (!batch.length) return; const fl = (await zf('GET', '/crm/v8/settings/fields?module=Leads')).j.fields; for (const b of batch) b.api = fl.find(f => f.id === b.id)?.api_name;
  const ids = {}; for (const [k, vals] of [['full', FULL], ['empty', {}]]) { let r = await zf('POST', '/crm/v8/Leads', { data: [recData(vals, 'QA FX Zoho ' + k)] }); let id = r.j?.data?.[0]?.details?.id;
    if (!id) { log('lead create', k, r.t.slice(0, 300)); const bad = r.j?.data?.[0]?.details?.api_name; if (bad) { const v2 = { ...vals }; for (const [t] of Object.entries(v2)) if (IN[t]?.api === bad) delete v2[t]; r = await zf('POST', '/crm/v8/Leads', { data: [recData(v2, 'QA FX Zoho ' + k)] }); id = r.j?.data?.[0]?.details?.id; } }
    ids[k] = id; }
  await sleep(3000);
  for (const k of ['full', 'empty']) { if (!ids[k]) continue; const g = await zf('GET', `/crm/v8/Leads/${ids[k]}`); const row = g.j?.data?.[0] || {}; for (const b of batch) (res[b.key].values ||= {})[k] = row[b.api] === undefined ? '(not returned)' : row[b.api]; if (k === 'full' && !made.fullInputs) { made.fullInputs = Object.fromEntries(Object.entries(IN).map(([t, v]) => [t, row[v.api]])); save(); } }
  for (const k of Object.keys(ids)) if (ids[k]) await zf('DELETE', `/crm/v8/Leads?ids=${ids[k]}`);
  for (const b of batch) { const d = await zf('DELETE', `/crm/v8/settings/fields/${b.id}?module=Leads`); if (d.s < 300) made.fx = (made.fx || []).filter(i => i !== b.id); } save(); saveRes(); batch = []; };
let n = 0;
for (const [fn, rt, build] of FZ) for (const t of Object.keys(IN)) { const key = fn + ' x ' + t; if (res[key]?.done) continue;
  if (!build) { res[key] = { done: true, accepted: null, note: 'no Zoho function' }; continue; }
  const expr = build(X(t)); let acc = false, out = [];
  for (const r0 of [rt, ...(ALT[rt] || [])]) { const r = await zf('POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: `QA FX z ${++n}`, data_type: 'formula', formula: { return_type: r0, expression: expr } }] }); const f0 = r.j?.fields?.[0];
    out.push(r0 + ':' + (f0?.code || r.s) + (f0?.message && f0.code !== 'SUCCESS' ? ' ' + f0.message : ''));
    if (f0?.details?.id) { acc = r0; (made.fx ||= []).push(f0.details.id); save(); batch.push({ key, id: f0.details.id }); break; }
    if (r.s === 429 || /LIMIT_EXCEEDED/i.test(f0?.code || '')) { log('LIMIT', key); await flush(); out.pop(); const r2 = await zf('POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: `QA FX z ${++n}`, data_type: 'formula', formula: { return_type: r0, expression: expr } }] }); const g0 = r2.j?.fields?.[0]; out.push(r0 + ':' + (g0?.code || r2.s) + ' (after flush)' + (g0?.message && g0.code !== 'SUCCESS' ? ' ' + g0.message : '')); if (g0?.details?.id) { acc = r0; (made.fx ||= []).push(g0.details.id); save(); batch.push({ key, id: g0.details.id }); break; } if (g0?.code !== 'DEPENDENT_MISMATCH') break; continue; }
    if (f0?.code !== 'DEPENDENT_MISMATCH') break; }
  res[key] = { done: true, expr, accepted: acc, tries: out }; saveRes();
  if (batch.length >= 8) await flush(); }
await flush();
const A = Object.values(res).filter(r => r.accepted).length, R = Object.values(res).filter(r => r.accepted === false).length; log({ pairs: Object.keys(res).length, accepted: A, refused: R, noFunction: Object.values(res).filter(r => r.accepted === null).length });
