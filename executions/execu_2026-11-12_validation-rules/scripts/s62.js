const mid = await modId(); for (const k of ['h9a', 'h9b', 'e7', 'x2']) if (I[k]) { await delRule(mid, I[k]); delete I[k]; }
const r = await mkRule(mid, { name: P + ' X6 broken', layoutId: I.layout, primaryField: 'qa_vr_ml', branches: [B(C('isEmpty', 'qa_vr_ml'), 'QA X6 ml is required')] }); I.x6 = r.j && r.j.data && r.j.data.id; SAVE(); return SR(r);
