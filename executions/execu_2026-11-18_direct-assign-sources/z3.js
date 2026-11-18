const DEP = '1499272000000006907', A2 = '1499272000000432034';
const crit = { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'subject', condition: 'starts with', value: ['QA RT22 DA'] }], pattern: '(1)' };
out.r = [];
for (const k of ['agentId']) {
  const v = k === 'assignTo' || k === 'toAgent' || k === 'assignee' ? { id: A2, type: 'AGENT' } : A2;
  const t = { fromDepartmentId: DEP, toDepartmentId: DEP, criteria: crit }; t[k] = v;
  const r = await api(page, 'POST', 'directAssignmentRules', { name: 'QA RT22 DA sources', description: 'QA', executeOptions: ['CREATE'], status: 'ACTIVE', targets: [t] });
  out.r.push(k + ' ' + r.s + ' ' + r.t.slice(0, 220)); if (r.s < 300) { out.id = r.j.id; break; }
}
