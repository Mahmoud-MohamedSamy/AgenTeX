const LAY = { leads:'bf971461-2edc-45f2-b6e4-6e180aa64288', contacts:'92269f8a-040c-4b00-8d33-cc323391dc3b', deals:'fcba0068-d67f-44f5-8412-cdef9c09e16e', accounts:'d817ff75-2107-4114-9141-71f5efbc04cf', tasks:'40c084f2-f062-45d5-ac70-132a7597fac0', calls:'58707442-1395-4eed-a015-be8280c9b4e6', meetings:'07224366-ebdc-4b6e-97c3-7a221d197d10', subscriptions:'f7156bdb-3581-4ec1-ad66-68af3236793b', agency:'c50b3765-4493-48d8-bd76-26ba7a97987f', services:'6412c81d-70b7-4a12-a585-baac18c13b61', dailymove:'15e0723f-afef-47e5-95cf-38f0c8e8d7f1', cases:'85e2cd1c-3139-436c-b06e-fbb91db46df3', po:'0f39965b-5894-4f92-9e90-c61092ddefe9', so:'43d321df-262d-4183-ad42-13114366b464', ndcagencies:'02c2efc5-6c56-4945-abf5-d9cb232cd066' };
const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const s = v => ({ kind: 'string', value: v });
const now = new Date(Date.now() + 86400000), later = new Date(Date.now() + 90000000);
const t = Date.now() % 100000;
const REQ = k => { const n = `QA W2 RC ${k} ${t}`; const b = { name: n };
  if (k === 'leads') Object.assign(b, { first_name: n, phone: '010' + String(10000000 + t).slice(0, 8), single_line_3_9: 'QA W2' });
  if (k === 'deals') Object.assign(b, { deal_name: n, stage: 'qualification' });
  if (k === 'accounts') b.account_name = n;
  if (k === 'tasks') Object.assign(b, { subject: n, status: 'Not Started' });
  if (k === 'calls') Object.assign(b, { call_type: 'outbound', call_start_time: now.toISOString(), call_duration: '5' });
  if (k === 'meetings') Object.assign(b, { title: n, meeting_venue: 'online', from_time: now.toISOString(), to_time: later.toISOString() });
  if (k === 'subscriptions') Object.assign(b, { subscription_name: n, owner: OWNER });
  if (k === 'cases') Object.assign(b, { status: 'New', case_origin: 'Web', subject: n });
  if (k === 'po' || k === 'so') b.subject = n;
  return b; };
const enc = o => Object.entries(o).map(([f, v]) => ({ field: f, value: s(v) }));
const val = (j, f) => { const d = j && j.data; const arr = d && (d.data || d.values || d.fields); if (Array.isArray(arr)) { const x = arr.find(e => e.field === f || e.apiName === f); return x && (x.value && x.value.value !== undefined ? x.value.value : x.value); } return d && (d[f] ?? (d.values && d.values[f])); };
const res = {};
for (const [k, id] of Object.entries(MODS).filter(([k]) => k === "calls")) { try {
  const r = {}; const body = REQ(k);
  const c = await call('POST', `/modules/${id}/records`, { layout_id: LAY[k], data: enc(body) });
  r.create = c.s; if (c.s >= 300) { r.err = c.t.slice(0, 300); res[k] = r; continue; }
  const rid = c.j.data.id; r.id = rid;
  const g = await call('GET', `/modules/${id}/records/${rid}`); r.get = g.s; r.owner0 = String(JSON.stringify(val(g.j, "owner")));
  if (!globalThis.__shape) { globalThis.__shape = 1; r.shape = JSON.stringify(g.j.data).slice(0, 600); }
  const p = await call('PATCH', `/modules/${id}/records/${rid}`, { data: [{ field: 'name', value: s(body.name + ' edited') }] }); r.patch = p.s; if (p.s >= 300) r.patchErr = p.t.slice(0, 200);
  const g2 = await call('GET', `/modules/${id}/records/${rid}`); r.name1 = val(g2.j, 'name'); r.owner1 = String(JSON.stringify(val(g2.j, "owner")));
  const bad = await call('POST', `/modules/${id}/records`, { layout_id: LAY[k], data: [] }); r.blankCreate = bad.s; if (bad.s < 300) { r.blankId = bad.j.data.id; await call('DELETE', `/modules/${id}/records/${r.blankId}`); }
  res[k] = r;
 } catch (e) { res[k] = { exc: String(e).slice(0, 300) }; } }
return res;
