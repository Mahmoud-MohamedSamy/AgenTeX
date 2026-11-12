const mid = await modId(); const L = I.layout; await delRule(mid, I.k2); delete I.k2;
const r = await mkRule(mid, { name: P + ' E7 url verify', layoutId: L, primaryField: 'qa_vr_url', fieldVerification: true, branches: [B(C('contains', 'qa_vr_url', 'bad'), 'QA E7 url cannot contain bad')] }); if (r.j && r.j.data) I.e7 = r.j.data.id; SAVE(); return SR(r).slice(0, 100);
