const DEP = '1499272000000006907', A2 = '1499272000000432034';
out.r = [];
const variants = [];
for (const fn of ['Subject', 'subject']) for (const cond of ['starts with', 'startsWith', 'contains']) for (const pat of ['1', '(1)']) variants.push({ fn, cond, pat });
for (const v of variants) {
  const crit = { fieldConditions: [{ fieldModule: 'tickets', fieldName: v.fn, condition: v.cond, value: ['QA RT22 DA'] }], pattern: v.pat };
  const r = await api(page, 'POST', 'directAssignmentRules', { name: 'QA RT22 DA sources', description: 'QA', executeOptions: ['CREATE'], status: 'ACTIVE', targets: [{ fromDepartmentId: DEP, toDepartmentId: DEP, agentId: A2, criteria: crit }] });
  out.r.push(JSON.stringify(v) + ' ' + r.s + ' ' + r.t.slice(0, 160)); if (r.s < 300) { out.id = r.j.id; out.used = v; break; }
}
