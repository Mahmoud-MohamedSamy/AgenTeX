const mid = await modId(); const lid = I.layout;
for (const x of await rules(mid)) if (x.name === P + ' lowpriv') log('del lowpriv', (await delRule(mid, x.id)).s);
const r = await mkRule(mid, { name: P + ' basic', description: 'qa', layoutId: lid, primaryField: 'qa_lr_type', branches: [br(eq('qa_lr_type', 'Refund'), [show(['qa_lr_order']), req(['qa_lr_order'])])] });
I.c1 = r.j?.data?.id; SAVE(); LED('restored desk basic rule after low-priv account (Desk Admin) deleted it: ' + I.c1);
const ndc = (await rules(mid)).filter(x => /^QA NDC/.test(x.name)).map(x => x.name + ' v' + x.rowVersion);
return { c1: SR(r), ndc };
