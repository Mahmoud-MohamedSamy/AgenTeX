// Two sample records on QA FX Matrix: every input filled, and every input empty. Reads back all formula values -> out/records.json
const M = made.mod, LID = made.layout, OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const mods = L((await api('GET', '/modules')).j?.data); const ACC = mods.find(m => m.moduleKey === 'accounts')?.id;
const first = async (paths) => { for (const p of paths) { const r = await api('GET', p); const l = L(r.j?.data); if (r.s < 300 && l.length) return { p, id: l[0].id, name: l[0].name || l[0].labels?.en || l[0].title || '' }; } return null; };
if (!made.acc) { const r = await api('POST', `/modules/${ACC}/records`, { data: data({ account_name: 'QA FX Matrix Acc', name: 'QA FX Matrix Acc' }) }); log('account', E(r).slice(0, 200)); if (r.j?.data?.id) { made.acc = r.j.data.id; keep(); led('CRM account QA FX Matrix Acc ' + made.acc); } }
const dep = await first(['/departments?limit=5', '/iam/departments?limit=5', '/desk/departments?limit=5']);
const team = await first(['/teams?limit=5', '/iam/teams?limit=5', '/iam/groups?limit=5']);
const tpl = await first(['/mail/templates?limit=5', '/mail/email-templates?limit=5', '/email-templates?limit=5']);
const plan = await first(['/support-plans?limit=5', '/desk/support-plans?limit=5']);
log('refs', { dep, team, tpl, plan });
const full = {
  name: 'QA FX Matrix - all filled', in_single_line: '  Hello World  ', in_multi_line: 'Line one\nLine two', in_rich_text: '<p><b>Bold</b> text</p>', in_email: 'Qa.Fx@Example.com', in_phone: '+20 100 123 4567', in_url: 'https://example.com/Path',
  in_number: -42, in_decimal: 3.14159, in_currency: 1234.5, in_percent: 12.5, in_long_integer: 9007199254740, in_checkbox: true, in_pick_list: 'Green', in_radio_button: 'B', in_status: 'Closed', in_multi_select: ['A', 'C'],
  in_date: '2026-11-24', in_date_time: '2026-11-24T21:30:00Z', in_lookup: made.acc, in_user: OWNER,
  in_address: { street: '1 Nile St', city: 'Cairo', country: 'Egypt' }, in_location: { lat: 30.04, lng: 31.23 }, in_map: { lat: 30.04, lng: 31.23 },
  in_multi_select_lookup: made.acc ? [made.acc] : undefined, in_department: dep?.id, in_team: team?.id, in_email_template: tpl?.id, in_support_plan: plan?.id,
  in_subform: [{ qty: 2, price: 10.5, note: 'first' }, { qty: 3, price: 20, note: 'second' }],
};
for (const k of Object.keys(full)) if (full[k] === undefined) delete full[k];
const res = { refs: { dep, team, tpl, plan }, dropped: [], records: {} };
const create = async (label, vals) => { const v = { ...vals };
  for (let i = 0; i < 15; i++) { const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data(v) });
    if (r.s < 300) return r.j.data.id;
    const det = r.j?.error?.details || []; const bad = det.map(d => String(d.path || d.field || '').split('.')[0].replace(/^data\[?\d*\]?/, '')).filter(p => p in v && p !== 'name');
    const fromMsg = Object.keys(v).filter(k => k !== 'name' && (String(r.j?.error?.message || '') + JSON.stringify(det)).includes(k));
    const drop = [...new Set([...bad, ...fromMsg])]; log(label, 'try', i, E(r).slice(0, 300));
    if (!drop.length) return null; for (const d of drop) { res.dropped.push({ field: d, value: v[d], why: E(r).slice(0, 200) }); delete v[d]; } }
  return null; };
if (!made.recFull) { made.recFull = await create('full', full); keep(); if (made.recFull) led('CRM QA FX Matrix record all filled ' + made.recFull); }
if (!made.recEmpty) { made.recEmpty = await create('empty', { name: 'QA FX Matrix - all empty' }); keep(); if (made.recEmpty) led('CRM QA FX Matrix record all empty ' + made.recEmpty); }
await sleep(3000);
for (const [k, id] of [['full', made.recFull], ['empty', made.recEmpty]]) if (id) res.records[k] = { id, values: await getRec(M, id) };
fs.writeFileSync(RUN + '/out/records.json', JSON.stringify(res, null, 1));
const fx = Object.keys(res.records.full?.values || {}).filter(n => /^fx_/.test(n));
log({ full: made.recFull, empty: made.recEmpty, dropped: res.dropped.map(d => d.field), fxValuesFull: fx.length, inputsFull: Object.keys(res.records.full?.values || {}).filter(n => /^in_/.test(n)) });
