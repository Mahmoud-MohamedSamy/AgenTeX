const mid = await modId(); const L = I.layout; const o = {};
const d = await api('POST', '/desk/departments', { name: P + ' C7 dept', description: 'qa', visibility: 'private' }); o.create = SR(d).slice(0, 200);
const id = d.j && d.j.data && d.j.data.id; if (!id) return o; I.c7dept = id; SAVE(); LED('dept ' + id);
const r = await mkRule(mid, { name: P + ' C7 dept rule', layoutId: L, primaryField: 'qa_vr_num', departmentIds: [id, I.base.department], branches: [B(C('gt', 'qa_vr_num', 100), 'QA C7')] }); o.rule = SR(r).slice(0, 200);
if (r.j && r.j.data) { I.c7 = r.j.data.id; SAVE(); }
let del = await api('DELETE', '/desk/departments/' + id); o.del = SR(del).slice(0, 250);
if (del.s >= 300) { const t = await api('POST', '/desk/departments/' + id + '/trash', {}); o.trash = SR(t).slice(0, 200); }
const g = r.j && r.j.data && (await getRule(mid, r.j.data.id)).j.data; o.after = g && `status=${g.status} depts=${JSON.stringify(g.departmentIds)} conditionError=${g.conditionError} warnings=${JSON.stringify(g.warnings)}`;
if (g) { const u = await putRule(mid, g.id, { ...g, description: 'C7 resave' }); o.resave = SR(u).slice(0, 200); }
return o;
