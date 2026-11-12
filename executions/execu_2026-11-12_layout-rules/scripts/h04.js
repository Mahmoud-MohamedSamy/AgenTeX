const mid = await modId(); const g = (await getRule(mid, I.b4_active)).j.data;
const u = await putRule(mid, I.b4_active, { ...g, applyToHelpCenter: true, branches: [br(eq('qa_lr_type', 'Refund'), [show(['qa_lr_note']), req(['qa_lr_note'])])] }); I.hc_r1 = I.b4_active; SAVE();
const a = (await getRule(mid, I.b4_active)).j.data; return { put: SR(u).slice(0, 200), hc: a.applyToHelpCenter, depts: a.departmentIds, acts: JSON.stringify(a.branches[0].actions) };
