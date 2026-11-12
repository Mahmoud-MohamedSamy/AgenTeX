const mid = await modId(); const out = {};
out.list = (await api('GET', '/modules/' + mid + '/layout-rules')).s;
const c = await api('POST', '/modules/' + mid + '/layout-rules', { name: P + ' A6 low', layoutId: I.layout, primaryField: 'qa_lr_tier', status: 'active', branches: [br(eq('qa_lr_tier', 'Silver'), [show(['qa_lr_order'])])] }); out.create = SR(c).slice(0, 200);
const id = c.j && c.j.data && c.j.data.id; if (id) { LED('A6 low user rule ' + id); I.a6rule = id; SAVE(); const g = (await getRule(mid, id)).j.data; out.edit = SR(await putRule(mid, id, { ...g, name: P + ' A6 low edited' })).slice(0, 120); out.del = (await delRule(mid, id)).s; }
return out;
