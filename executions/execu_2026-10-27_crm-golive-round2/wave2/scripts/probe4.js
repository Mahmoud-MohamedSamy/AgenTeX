const o = as(OWNER), A = as(ADMA);
const me = await A.get('/iam/me/profile'); const admaId = (me.j && (me.j.user_id || (me.j.data && me.j.data.user_id)));
const ome = await o.get('/iam/me/profile'); const ownerId = (ome.j && (ome.j.user_id || (ome.j.data && ome.j.data.user_id)));
out.ids = { admaId, ownerId };
const t = Date.now() % 100000; const created = { leads: [], cases: [], po: [], so: [] };
const mk = async (k, f) => { const r = await o.post(`/modules/${MODS[k]}/records`, { layout_id: LAY[k], data: enc(f) }); if (r.s < 300) created[k].push(r.j.data.id); return r; };
// --- mass update / transfer on 2 leads
for (const i of [1, 2]) await mk('leads', { first_name: `QA R2W2 MU ${t} ${i}`, phone: '0101' + String(3000000 + t + i).slice(0, 7), single_line_3_9: 'QA R2W2' });
const mu = async (k, ids, data) => { const r = await o.post(`/modules/${MODS[k]}/records/mass-update`, { record_ids: ids, data: enc(data) }); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 220) : ''); };
const L = created.leads;
out.mu = {};
for (const [f, v] of [['company', 'QA R2W2 Co'], ['email', 'qa.r2w2@example.com'], ['lead_source', 'web'], ['lead_status', 'Busy'], ['lead_status_comment', 'line1\nline2'], ['owner', admaId]]) {
  out.mu[f] = await mu('leads', L, { [f]: v }); await sleep(800);
  const g = await o.get(`/modules/${MODS.leads}/records/${L[1]}`); out.mu[f] += ' -> stored ' + JSON.stringify(val(g.j, f)).slice(0, 80);
}
out.adminASeesTransferred = (await A.get(`/modules/${MODS.leads}/records/${L[0]}`)).s;
// --- Cases full
const today = new Date().toISOString().slice(0, 10);
const cr = await mk('cases', { name: `QA R2W2 Case ${t}`, subject: `QA R2W2 Case ${t}`, status: 'New', case_origin: 'Email', priority: 'High', type: 'Problem', email: 'qa.case@example.com', phone: '01011112222', description: 'desc عربي', no_of_comments: { kind: 'number', value: 3 }, multi_select: { kind: 'string_list', value: ['Option 1', 'قنا'] }, owner: ownerId });
out.caseCreate = cr.s + (cr.s >= 300 ? ' ' + cr.t.slice(0, 300) : '');
if (cr.s >= 300) { const cr2 = await mk('cases', { name: `QA R2W2 Case ${t}`, subject: `QA R2W2 Case ${t}`, status: 'New', case_origin: 'Email', priority: 'High', type: 'Problem', email: 'qa.case@example.com', phone: '01011112222', description: 'desc عربي', no_of_comments: { kind: 'number', value: 3 }, owner: ownerId }); out.caseCreateNoMulti = cr2.s + ' ' + cr2.t.slice(0, 200); }
const cid = created.cases[0];
if (cid) { const g = await o.get(`/modules/${MODS.cases}/records/${cid}`); out.caseRead = ['priority', 'type', 'email', 'phone', 'description', 'no_of_comments', 'multi_select', 'case_number'].map(f => f + '=' + JSON.stringify(val(g.j, f))).join('; ');
  out.caseEdit = (await o.patch(`/modules/${MODS.cases}/records/${cid}`, { data: enc({ status: 'Escalated', solution: 'QA solution' }) })).s;
  out.caseMU = await mu('cases', [cid], { priority: 'Low' }); }
// --- PO with dates/currency/subform
const po = await mk('po', { name: `QA R2W2 PO ${t}`, subject: `QA R2W2 PO ${t}`, po_date: { kind: 'date', value: today }, due_date: { kind: 'date', value: today }, carrier: 'DHL', status: 'Created', tax: { kind: 'number', value: 12.5 }, discount: { kind: 'number', value: 5 }, currency: 'EGP', exchange_rate: { kind: 'number', value: 1.25 }, owner: ownerId });
out.poCreate = po.s + (po.s >= 300 ? ' ' + po.t.slice(0, 300) : '');
const pid = created.po[0];
if (pid) { const g = await o.get(`/modules/${MODS.po}/records/${pid}`); out.poRead = ['po_date', 'due_date', 'carrier', 'tax', 'discount', 'currency', 'exchange_rate', 'purchase_items'].map(f => f + '=' + JSON.stringify(val(g.j, f))).join('; ');
  out.poMU = await mu('po', [pid], { status: 'Approved', due_date: { kind: 'date', value: today } }); }
const so = await mk('so', { name: `QA R2W2 SO ${t}`, subject: `QA R2W2 SO ${t}`, status: 'S', branch: 'Mansoura', mobile: { kind: 'number', value: 1012345678 }, email: 'qa.so@example.com', date_of_birth: { kind: 'date', value: '1990-05-01' }, amount: { kind: 'number', value: 1500 }, owner: ownerId });
out.soCreate = so.s + (so.s >= 300 ? ' ' + so.t.slice(0, 300) : '');
if (created.so[0]) { const g = await o.get(`/modules/${MODS.so}/records/${created.so[0]}`); out.soRead = ['branch', 'mobile', 'email', 'date_of_birth', 'amount'].map(f => f + '=' + JSON.stringify(val(g.j, f))).join('; '); }
out.created = created;
