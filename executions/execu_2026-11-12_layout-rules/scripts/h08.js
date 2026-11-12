const mid = await modId(); const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'; const out = {};
const g = await getLayout(mid, I.layout);
const u = await api('PUT', '/modules/' + mid + '/layouts/' + I.layout, { ...g, departmentIds: [CS], displayInHelpCenter: true, helpCenterDisplayName: 'QA LR1112 HC form' }); out.layout = SR(u).slice(0, 200); LED('HC: QA layout on CS + Help Center');
const mk = async (k, body) => { const r = await mkRule(mid, body); out[k] = SR(r).slice(0, 200); if (r.j && r.j.data) { I[k] = r.j.data.id; SAVE(); LED('rule ' + body.name + ' ' + r.j.data.id); } };
await mk('hc_on', { name: P + ' HC type', layoutId: I.layout, primaryField: 'qa_lr_type', status: 'active', applyToHelpCenter: true, departmentIds: [CS], branches: [br(eq('qa_lr_type', 'Refund'), [show(['qa_lr_note']), req(['qa_lr_note'])]), br(eq('qa_lr_type', 'Question'), [show(['qa_lr_filter'])])] });
await mk('hc_off', { name: P + ' HC off', layoutId: I.layout, primaryField: 'qa_lr_tier', status: 'active', applyToHelpCenter: false, departmentIds: [CS], branches: [br(eq('qa_lr_tier', 'Gold'), [show(['qa_lr_order'])])] });
// what does the layout say about Help Center visibility per field?
const g2 = await getLayout(mid, I.layout); const f = []; for (const [vk, v] of Object.entries(g2.views)) for (const s of v.layout.sections) for (const c of s.columns) for (const e of c.fields) if (/qa_lr_(type|note)$/.test(e.fieldName)) f.push(vk + ' ' + e.fieldName + ' ' + JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k]) => /help|hc|portal|visib|customer/i.test(k)))).slice(0, 200));
out.fieldHC = f; out.views = Object.keys(g2.views); return out;
