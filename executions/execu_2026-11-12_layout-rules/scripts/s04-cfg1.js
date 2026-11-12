// CRM/Desk scenario set 1 on the QA layout
const mid = await modId(); const lid = I.layout;
const g = (await getRule(mid, I.c1)).j.data;
const b1 = [br(eq('qa_lr_type', 'Refund'), [show(['qa_lr_order']), req(['qa_lr_order'])]),
  br({ op: 'in', field: 'qa_lr_type', values: ['Question', 'Partner'] }, [secs(['sec-qa-lr-b'])]),
  br({ op: 'and', children: [eq('qa_lr_type', 'Other'), { op: 'gt', field: 'qa_lr_amount', value: 10 }] }, [show(['qa_lr_order'])])];
const u = await putRule(mid, I.c1, { ...g, name: P + ' basic', status: 'active', branches: b1 }); log('R1', SR(u));
const mk = async (key, body) => { if (I[key]) { const x = (await getRule(mid, I[key])).j?.data; if (x) return log(key, SR(await putRule(mid, I[key], { ...x, ...body }))); } const r = await mkRule(mid, { layoutId: lid, description: 'qa', ...body }); I[key] = r.j?.data?.id; SAVE(); log(key, SR(r)); };
await mk('r2', { name: P + ' tier', primaryField: 'qa_lr_tier', branches: [br(eq('qa_lr_tier', 'Gold'), [show(['qa_lr_reason'])]), br({ op: 'in', field: 'qa_lr_tier', values: ['Gold', 'Silver'] }, [req(['qa_lr_note'])]), br(eq('qa_lr_tier', 'Bronze'), [req(['qa_lr_order'])])] });
await mk('r3', { name: P + ' vip', primaryField: 'qa_lr_vip', branches: [br(eq('qa_lr_vip', true), [show(['qa_lr_date'])])] });
if (APP === 'crm') await mk('r4', { name: P + ' radio', primaryField: 'qa_lr_radio', branches: [br(eq('qa_lr_radio', 'Yes'), [req(['qa_lr_email2'])])] });
if (I.xss) { const x = await delRule(mid, I.xss); log('del xss', x.s); delete I.xss; SAVE(); }
return (await rules(mid, '?layoutId=' + lid)).map(r => r.name + ' ' + r.status + ' ' + r.sortOrder);
