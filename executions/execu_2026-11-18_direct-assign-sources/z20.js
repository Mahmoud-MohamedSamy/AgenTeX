const D = '1499272000000006907', A2 = '1499272000000432034';
const crit = { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: 'starts with', value: ['QA RT22 RR'] }], pattern: '1' };
const bodies = [];
for (const eo of [['CREATE'], 'CREATE']) for (const tg of [{ criteria: crit, agentIds: [A2] }, { criteria: crit, agentIds: [A2], assignmentType: 'SEQUENTIAL' }, { criteria: crit, assignees: [A2] }])
  bodies.push({ name: 'QA RT22 RR on create', departmentId: D, executeOn: eo, status: 'ACTIVE', targets: [tg] });
out.r = [];
for (const b of bodies) { const r = await api(page, 'POST', 'roundRobinRules', b); out.r.push(JSON.stringify(b.executeOn) + ' ' + Object.keys(b.targets[0]).join('/') + ' -> ' + r.s + ' ' + r.t.slice(0, 220)); if (r.s < 300) { out.id = r.j && (r.j.id || r.j.ruleId); break; } }
