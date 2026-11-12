const mid = await modId(); const r = await mkRule(mid, { name: P + ' BP note', layoutId: I.layout, primaryField: 'qa_vr_note', branches: [B(C('startsWith', 'qa_vr_note', 'BAD'), 'QA BP note cannot start with BAD')] }); I.bpnote = r.j && r.j.data && r.j.data.id;
const rec = await mkRec(mid, { ...I.base, qa_vr_pick: 'Open' }, I.layout); SAVE(); return r.s + ' ' + rec.s + ' ' + rec.id;
