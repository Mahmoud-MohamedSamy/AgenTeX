const mid = await modId(); const out = {}; const f = x => FP + x;
// G1 CRM primary field types
const Fs = await fieldsOf(mid); const onLay = new Set((await getLayout(mid, I.layout)).views.CREATE.layout.sections.flatMap(s => s.columns.flatMap(c => c.fields.map(x => x.fieldName))));
const cand = { text: f('text'), number: f('amount'), email: f('email2'), phone: 'phone', company: 'company' };
for (const [k, fn] of Object.entries(cand)) { const r = await mkRule(mid, { layoutId: I.layout, name: P + ' pt ' + k, primaryField: fn, status: 'disabled', branches: [br({ op: 'isNotEmpty', field: fn }, [show([f('reason')])])] }, 'Leads'); out['pf_' + k] = SR(r).slice(0, 250); if (r.j && r.j.data) { await delRule(mid, r.j.data.id); LED('  deleted again ' + r.j.data.id); } }
out.dtypes = Fs.filter(x => ['phone', 'company', 'email'].includes(x.fieldName)).map(x => x.fieldName + ':' + x.datatypeKey);
// G3 move a record to another layout
const std = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).find(x => x.name === 'Standard');
const r0 = await recVals(mid, I.massB); const before = (await api('GET', '/modules/' + mid + '/records/' + I.massB)).j.data; out.layBefore = before.created_with_layout_id || before.layout_id || before.layoutId;
const p = await api('PATCH', '/modules/' + mid + '/records/' + I.massB, { layout_id: std.id, data: [] }); out.patchLayout = SR(p).slice(0, 300);
const after = (await api('GET', '/modules/' + mid + '/records/' + I.massB)).j.data; out.layAfter = after.created_with_layout_id || after.layout_id || after.layoutId; out.recKeys = Object.keys(after).filter(k => /layout/i.test(k)).join(',');
// G6 permission catalog
const pc = await api('GET', '/iam/permissions'); const keys = arr(pc.j && pc.j.data).map(x => x.key || x.permissionKey || x.code || x.name || JSON.stringify(x).slice(0, 80)); out.permCount = keys.length; out.layoutPerms = keys.filter(k => /layout|customi|metadata/i.test(k));
return out;
