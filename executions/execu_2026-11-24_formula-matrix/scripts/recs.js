// Generic test records for a built module. env SPEC=matrix|ops, DESK=1 for Desk. Sets: full, empty, edge1 (new record), edge2 (applied as an EDIT of a copy of full = recalc test), child rollup.
// Output out/recs-<app>-<spec>.json  { key: { id, values } }
const SPEC = process.env.SPEC || 'matrix', isDesk = !!process.env.DESK, app = isDesk ? 'desk' : 'crm';
const st = (made[SPEC] ||= {}); if (SPEC === 'matrix' && !isDesk && !st.mod) { st.mod = made.mod; st.layout = made.layout; st.layout2 = made.layout2; }
const M = st.mod, OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7'; const res = { notes: [] };
const mods = L((await api('GET', '/modules')).j?.data); const ACC = mods.find(m => m.moduleKey === (isDesk ? 'desk_accounts' : 'accounts'))?.id;
if (!made.acc2) { if (!isDesk && made.acc) made.acc2 = made.acc; else { const r = await api('POST', `/modules/${ACC}/records`, { data: data({ account_name: 'QA FX Matrix ' + app + ' Acc', name: 'QA FX Matrix ' + app + ' Acc' }) }); if (r.j?.data?.id) { made.acc2 = r.j.data.id; led(app + ' account QA FX Matrix Acc ' + made.acc2); } else res.notes.push('account ' + E(r).slice(0, 150)); } keep(); }
const deps = L((await api('GET', '/desk/departments?limit=100', undefined, { app: 'desk' })).j?.data);
const plans = L((await api('GET', '/desk/sla/support-plans?limit=100', undefined, { app: 'desk' })).j?.data);
const plan = plans.find(p => !p.discontinued && !p.is_discontinued && (p.status || 'active') !== 'discontinued') || null; res.plan = plan && { id: plan.id, name: plan.name, dep: plan.department_id, status: plan.status };
const DEP = (plan && plan.department_id) || deps[0]?.id;
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const up = async (name, type, bytes, purpose) => { const c = await api('POST', '/files', { app_key: app, purpose, ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, owner_user_id: OWNER, declared_size_bytes: bytes.length });
  if (c.s >= 300) return null; const p = await fetch(c.j.data.upload_url, { method: 'PUT', headers: { 'content-type': type }, body: bytes }).catch(() => ({ status: 0 }));
  const cf = await api('POST', `/files/${c.j.data.file_id}/confirm`, { file_id: c.j.data.file_id, size_bytes: bytes.length }); return p.status < 300 && cf.s < 300 ? { file_id: c.j.data.file_id, filename: name, size_bytes: bytes.length, mime: type, url: c.j.data.file_id } : null; };
const fk = 'files_' + app; if (!made[fk]) { made[fk] = { doc: await up('qa-fx-doc.txt', 'text/plain', Buffer.from('QA FX doc'), 'document'), img: await up('qa-fx-img.png', 'image/png', png, 'photo'), cam1: await up('qa-fx-cam1.png', 'image/png', png, 'photo'), cam2: await up('qa-fx-cam2.png', 'image/png', png, 'photo') }; keep(); }
const F = made[fk]; const now = new Date().toISOString();
const full = { in_single_line: '  Hello World  ', in_multi_line: 'Line one\nLine two', in_rich_text: '<p><b>Bold</b> text</p>', in_email: 'Qa.Fx@Example.com', in_phone: '+20 100 123 4567', in_url: 'https://example.com/Path',
  in_number: -42, in_decimal: 3.14159, in_currency: 1234.5, in_percent: 12.5, in_long_integer: 9007199254740, in_checkbox: true, in_pick_list: 'Green', in_radio_button: 'B', in_status: 'Closed', in_multi_select: ['A', 'C'],
  in_date: '2026-11-24', in_date_time: '2026-11-24T21:30:00Z', in_lookup: made.acc2, in_user: OWNER, in_address: { street: '1 Nile St', city: 'Cairo', country: 'Egypt' }, in_location: { lat: 30.04, lng: 31.23 }, in_map: { lat: 30.04, lng: 31.23 },
  in_multi_select_lookup: [made.acc2], in_department: DEP, in_support_plan: plan?.id, in_email_template: 'introduction', in_file_upload: F.doc, in_image_upload: F.img, in_camera: F.cam1 ? [{ ...F.cam1, captured_at: now }] : undefined,
  in_subform: [{ qty: 2, price: 10.5, note: 'first' }, { qty: 3, price: 20, note: 'second' }] };
const edge1 = { in_single_line: 'مرحبا بالعالم 😀', in_multi_line: 'x'.repeat(3000), in_rich_text: '<script>alert(1)</script>', in_email: 'UPPER@EXAMPLE.COM', in_phone: '0', in_url: 'http://a.b',
  in_number: 0, in_decimal: 0.1, in_currency: -0.005, in_percent: 100, in_long_integer: 9007199254740993, in_checkbox: false, in_pick_list: 'Red', in_radio_button: 'A', in_status: 'Open', in_multi_select: ['A', 'B', 'C'],
  in_date: '2028-02-29', in_date_time: '2026-11-24T22:30:00Z', in_lookup: made.acc2, in_user: OWNER, in_address: { city: 'الإسكندرية' }, in_location: { lat: -33.9, lng: 151.2 }, in_map: { lat: 0, lng: 0 },
  in_multi_select_lookup: [made.acc2], in_department: DEP, in_email_template: 'introduction', in_file_upload: F.doc, in_image_upload: F.img, in_camera: F.cam1 && F.cam2 ? [{ ...F.cam1, captured_at: now }, { ...F.cam2, captured_at: now }] : undefined,
  in_subform: [{ qty: 1 }, { price: 5.555 }, { note: 'x' }] };
const edge2 = { in_single_line: '   ', in_multi_line: 'a\n\nb', in_rich_text: '', in_email: null, in_phone: null, in_url: null,
  in_number: -2.55, in_decimal: 2.25, in_currency: 1000000000, in_percent: -12.5, in_long_integer: -1, in_checkbox: false, in_pick_list: 'Blue', in_radio_button: null, in_status: 'Open', in_multi_select: [],
  in_date: '1970-01-01', in_date_time: '2026-07-01T21:30:00Z', in_lookup: null, in_user: null, in_address: null, in_location: null, in_map: null, in_multi_select_lookup: [], in_department: null, in_support_plan: null, in_email_template: null,
  in_file_upload: null, in_image_upload: null, in_camera: [], in_subform: [{ qty: 4, price: 2.5, note: 'He said "hi"' }] };
const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const LID = st.layout || null;
const create = async (key, label, vals, lay = LID) => { if (st[key]) return st[key]; let v = clean(vals);
  for (let i = 0; i < 12; i++) { const r = await api('POST', `/modules/${M}/records`, { ...(lay ? { layout_id: lay } : {}), data: data({ name: label, ...v }) });
    if (r.s < 300) { st[key] = r.j.data.id; keep(); led(`${app} ${SPEC} record ${label} ${st[key]}`); return st[key]; }
    const det = JSON.stringify(r.j?.error?.details || []) + (r.j?.error?.message || ''); const bad = Object.keys(v).filter(k => det.includes('"' + k) || det.includes(k + '[') || det.includes(k + '"'));
    res.notes.push(`${key}: ${E(r).slice(0, 220)}`); if (!bad.length) return null; for (const b of bad) { res.notes.push(`${key}: dropped ${b}`); delete v[b]; } } return null; };
await create('rFull', 'QA FX ' + SPEC + ' - all filled', full);
await create('rEmpty', 'QA FX ' + SPEC + ' - all empty', {});
await create('rEdge1', 'QA FX ' + SPEC + ' - edge values', edge1);
if (st.layout2) await create('rFull2', 'QA FX ' + SPEC + ' 2 - all filled', full, st.layout2);
await create('rEdit', 'QA FX ' + SPEC + ' - edited (recalc)', full);
// recalc on edit: change every input of rEdit to edge2 values
if (st.rEdit && !st.edited) { let v = clean(edge2); for (let i = 0; i < 10; i++) { const r = await api('PATCH', `/modules/${M}/records/${st.rEdit}`, { data: data(v) }); if (r.s < 300) { st.edited = true; keep(); break; }
  const det = JSON.stringify(r.j?.error?.details || []); const bad = Object.keys(v).filter(k => det.includes('"' + k)); res.notes.push('edit: ' + E(r).slice(0, 200)); if (!bad.length) break; bad.forEach(b => { res.notes.push('edit dropped ' + b); delete v[b]; }); } }
if (st.rFull && !st.child) { const r = await api('POST', `/modules/${M}/records`, { ...(LID ? { layout_id: LID } : {}), data: data({ name: 'QA FX ' + SPEC + ' child', in_parent: st.rFull, in_number: 5 }) }); if (r.j?.data?.id) { st.child = r.j.data.id; keep(); } }
await sleep(3000); if (st.rFull) await api('PATCH', `/modules/${M}/records/${st.rFull}`, { data: data({ name: 'QA FX ' + SPEC + ' - all filled' }) });
await sleep(2000);
const out = {}; for (const k of ['rFull', 'rFull2', 'rEmpty', 'rEdge1', 'rEdit']) if (st[k]) out[k] = { id: st[k], values: await getRec(M, st[k]) };
fs.writeFileSync(RUN + `/out/recs-${app}-${SPEC}.json`, JSON.stringify(out, null, 1));
res.records = Object.fromEntries(Object.entries(out).map(([k, r]) => [k, { id: r.id, inputs: Object.entries(r.values).filter(([n, v]) => /^in_/.test(n) && v != null && !(Array.isArray(v) && !v.length)).length, fx: Object.keys(r.values).filter(n => /^fx_/.test(n)).length, rollup: r.values.in_rollup_summary }]));
fs.writeFileSync(RUN + `/out/recs-${app}-${SPEC}-notes.json`, JSON.stringify(res, null, 1)); log(res);
