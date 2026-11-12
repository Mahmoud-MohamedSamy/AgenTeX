const mid = await modId(); const out = {}; const me = (await api('GET', '/iam/me')).j.data; out.deskProfile = me.profiles_by_app.desk.map(p => p.name).join(',');
const l = await api('GET', '/modules/' + mid + '/layout-rules'); out.list = l.s + ' n=' + arr(l.j && l.j.data).length;
out.create = SR(await api('POST', '/modules/' + mid + '/layout-rules', { name: P + ' A4 agent', layoutId: I.layout, primaryField: 'qa_lr_tier', status: 'active', branches: [br(eq('qa_lr_tier', 'Silver'), [show(['qa_lr_order'])])] })).slice(0, 120);
const g = await getRule(mid, I.b4_active); out.get = g.s;
out.put = SR(await putRule(mid, I.b4_active, { ...(g.j.data || {}), name: P + ' A4 hacked' })).slice(0, 120);
out.order = SR(await api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: I.layout, ruleIds: [I.b4_disabled, I.b4_active] })).slice(0, 120);
out.del = SR(await delRule(mid, I.b4_disabled)).slice(0, 120);
return out;
