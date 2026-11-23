const rules = (await allRules()).filter(r => /TC-01|changed/i.test(r.name) || JSON.stringify(r.criteria || '').includes('"Changed"'));
const us = arr((await api('GET', '/iam/users?take=200&app_key=desk')).j?.data); const nm = id => id ? (us.find(u => u.userId === id)?.displayName || id.slice(0, 8)) : null;
const out = [];
for (const r of rules.filter(r => !/^QA WF /.test(r.name))) {
  const ex = arr((await api('GET', `/workflow/executions?ruleId=${r.id}&take=50`)).j?.data);
  const runs = []; for (const e of ex.slice(0, 10)) { const g = await getTicket(e.recordId); runs.push([(e.evaluatedAt || '').slice(11, 19), e.triggerKind, outcome(e), g.ticket_number, (g.subject || '(deleted)').slice(0, 20), 'prio ' + g.priority, (e.dispatches || []).map(d => d.actionType + '=' + d.status).join(';')].join(' | ')); }
  out.push({ name: r.name, id: r.id, active: r.isActive, v: r.version, trigger: JSON.stringify(r.trigger).replace(/"[a-zA-Z]+":null,?/g, '').slice(0, 160), criteria: JSON.stringify(r.criteria).replace(/"[a-zA-Z]+":null,?/g, '').slice(0, 300), actions: r.actions.map(a => a.type + ' ' + JSON.stringify(a.fieldUpdates || a.ownerValue || '').slice(0, 80)), depts: r.departmentIds, runs });
}
return out;
