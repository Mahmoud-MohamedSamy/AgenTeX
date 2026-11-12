const mid = await modId(); const rec = await mkRec(mid, { ...I.base, qa_vr_pick: 'Open' }, I.layout);
const r1 = await mkRule(mid, { name: P + ' BP text2', layoutId: I.layout, primaryField: 'qa_vr_text', branches: [B(C('startsWith', 'qa_vr_text', 'BAD'), 'QA BP text cannot start with BAD')] }); I.bptext = r1.j && r1.j.data && r1.j.data.id; SAVE();
return rec.s + ' ' + rec.id + ' rule ' + r1.s;
