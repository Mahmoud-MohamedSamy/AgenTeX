const mid = await modId(); const r = await mkRule(mid, { name: P + ' G17 subject', layoutId: I.defLayout, departmentIds: [I.base.department], primaryField: 'subject', branches: [B(C('startsWith', 'subject', 'QA VR1112 BADMAIL'), 'QA G17 subject cannot start with QA VR1112 BADMAIL')] });
I.g17 = r.j && r.j.data && r.j.data.id; SAVE(); return SR(r).slice(0, 300);
