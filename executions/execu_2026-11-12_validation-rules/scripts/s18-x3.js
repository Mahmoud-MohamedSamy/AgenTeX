const mid = await modId(); const L = I.layout;
const r4 = (await rules(mid)).find(r => r.name === P + ' R4 pick'); if (r4) { await putRule(mid, r4.id, { ...r4, status: 'disabled' }); LED('desk R4 disabled for X3'); }
const r = await mkRule(mid, { name: P + ' X3 reject reason', layoutId: L, primaryField: 'qa_vr_ml', branches: [B(C('isNull', 'qa_vr_ml'), 'Please add a clear rejection reason', { when: C('eq', 'qa_vr_pick', 'Reject') })] });
return SR(r).slice(0, 200);
