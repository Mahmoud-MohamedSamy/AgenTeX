const D = '1499272000000006907', A2 = '1499272000000432034';
const crit = { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: 'starts with', value: ['QA RT22 RR'] }], pattern: '1' };
const tries = [
 { name: 'QA RT22 RR on create', departmentId: D, executeOptions: ['CREATE'], status: 'ACTIVE', targets: [{ criteria: crit, agentIds: [A2] }] },
];
out.r = [];
for (let b of tries) { for (let k = 0; k < 10; k++) { const r = await api(page, 'POST', 'roundRobinRules', b); out.r.push(r.s + ' ' + r.t.slice(0, 250)); if (r.s < 300) { out.id = r.j && (r.j.id || r.j.ruleId); break; }
  const m = (r.t.match(/extra parameter '([^']+)'/) || [])[1]; if (m) { const strip = o => { if (Array.isArray(o)) return o.map(strip); if (o && typeof o === 'object') { const c = {}; for (const [kk, v] of Object.entries(o)) if (kk !== m) c[kk] = strip(v); return c; } return o; }; b = strip(b); continue; }
  const miss = (r.t.match(/parameter '([^']+)' is missing/) || [])[1]; if (miss) { out.miss = miss; break; } break; } }
