const mid = await modId(); const out = {};
const src = await getLayout(mid, I.layout); const b = JSON.parse(JSON.stringify(src)); delete b.id; b.name = P + ' Layout J7'; for (const k of ['displayInHelpCenter','helpCenterDisplayName','departmentIds','defaultDepartmentIds','ticketStatuses','allowNonDepartmentAgents','rowVersion','createdAt','lastModifiedAt','isDefault','is_default']) delete b[k];
const c = await api('POST', '/modules/' + mid + '/layouts', b); out.create = SR(c).slice(0, 300); const lid = c.j && c.j.data && c.j.data.id; if (!lid) return out; LED('layout J7 ' + lid); I.layJ7 = lid; SAVE();
const r = await mkRule(mid, { name: P + ' J7 rule', layoutId: lid, primaryField: 'qa_lr_type', branches: [br(eq('qa_lr_type', 'Refund'), [show(['qa_lr_order'])])] }); out.rule = SR(r).slice(0, 200); const rid = r.j.data && r.j.data.id;
const d = await api('DELETE', '/modules/' + mid + '/layouts/' + lid); out.delLayout = SR(d).slice(0, 300);
if (rid) { const g = await getRule(mid, rid); out.ruleAfter = SR(g).slice(0, 200) + ' ' + (g.j.data ? g.j.data.status + ' ' + JSON.stringify(g.j.data.definitionError || null) : ''); out.inList = (await rules(mid)).filter(x => x.id === rid).length; }
return out;
