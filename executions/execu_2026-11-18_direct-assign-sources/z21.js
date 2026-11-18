const D = '1499272000000006907', A2 = '1499272000000432034';
const crit = { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: 'starts with', value: ['QA RT22 RR'] }], pattern: '1' };
out.r = [];
for (const at of ['SEQUENTIAL_ROUND_ROBIN', 'ROUND_ROBIN', 'ROUNDROBIN', 'Sequential', 'sequential', 'LOAD_BALANCING', 'LOAD_BASED', 'LOADBASED', 'NORMAL', 'DEFAULT']) {
  const r = await api(page, 'POST', 'roundRobinRules', { name: 'QA RT22 RR on create', departmentId: D, executeOn: ['CREATE'], status: 'ACTIVE', targets: [{ criteria: crit, agentIds: [A2], assignmentType: at }] });
  out.r.push(at + ' -> ' + r.s + ' ' + r.t.slice(0, 160)); if (r.s < 300) { out.id = r.j && (r.j.id || r.j.ruleId); break; } }
