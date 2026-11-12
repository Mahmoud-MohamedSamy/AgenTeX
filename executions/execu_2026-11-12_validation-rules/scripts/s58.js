const mid = await modId(); const L = I.layout; const o = {};
const mk = async (k, b) => { const r = await mkRule(mid, b); o[k] = SR(r).slice(0, 160); if (r.j && r.j.data) I[k] = r.j.data.id; };
await mk('h9a', { name: P + ' H9 phone verify', layoutId: L, primaryField: 'qa_vr_phone', fieldVerification: true, branches: [B(C('startsWith', 'qa_vr_phone', '+999'), 'QA H9 phone cannot start with +999')] });
await mk('h9b', { name: P + ' H9 note warn', layoutId: L, primaryField: 'qa_vr_note', mode: 'warn', branches: [B(C('contains', 'qa_vr_note', 'warn'), 'QA H9 note says warn - save anyway?')] });
await mk('e7', { name: P + ' E7 url verify', layoutId: L, primaryField: 'qa_vr_url', fieldVerification: true, branches: [B(C('contains', 'qa_vr_url', 'bad'), 'QA E7 url cannot contain bad')] });
await mk('x2', { name: P + ' X2 discount', layoutId: L, primaryField: 'qa_vr_pct', mode: 'warn', branches: [B(C('gt', 'qa_vr_pct', 15), 'Discount over 15% needs a manager note', { when: C('eq', 'qa_vr_pick', 'Reject') })] });
const lr = await api('POST', '/modules/' + mid + '/layout-rules', { name: P + ' E7 layout rule', layoutId: L, primaryField: 'qa_vr_pick', status: 'active', branches: [{ condition: { op: 'eq', field: 'qa_vr_pick', value: 'Done' }, actions: [{ type: 'show_fields', fields: ['qa_vr_url'] }] }] });
o.lr = SR(lr).slice(0, 200); if (lr.j && lr.j.data) I.e7lr = lr.j.data.id; SAVE(); return o;
