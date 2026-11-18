const DEP = '1499272000000006907', A2 = '1499272000000432034';
const bodies = [
 { name: 'QA RT22 DA sources', description: 'QA', executeOptions: ['CREATE'], status: 'ACTIVE', targets: [{ fromDepartmentId: DEP, criteria: { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'subject', condition: 'starts with', value: ['QA RT22 DA'] }], pattern: '(1)' }, toAgentId: A2 }] },
];
out.r = [];
for (const b of bodies) { const r = await api(page, 'POST', 'directAssignmentRules', b); out.r.push({ s: r.s, t: r.t }); if (r.s < 300) { out.id = r.j.id; break; } }
