const mid = await modId(); const out = {};
// H3: field already a target in rule 'QA LR1112 basic' (show order); new rule on tier targets order too
const r = await mkRule(mid, { name: P + ' H3', layoutId: I.layout, primaryField: 'qa_lr_tier', status: 'disabled', branches: [br(eq('qa_lr_tier', 'Gold'), [show(['qa_lr_order'])])] }); out.H3 = SR(r).slice(0, 300); if (r.j.data) await delRule(mid, r.j.data.id);
// I5: count rules/active limits: create rules on a department until refused? only report counts
out.counts = (await rules(mid)).length + ' total; active ' + (await rules(mid, '?status=active')).length;
return out;
