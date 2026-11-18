const D = '1499272000000006907', A2 = '1499272000000432034';
let b = { name: 'QA RT22 WF owner on create', module: 'tickets', departmentId: D, executeOn: ['CREATE'], status: 'ACTIVE', description: 'QA',
  criteria: { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: 'starts with', value: ['QA RT22 WF'] }], pattern: '1' },
  actions: { fieldUpdates: [{ fieldName: 'Ticket Owner', value: A2 }] } };
out.r = [];
for (let k = 0; k < 8; k++) { const r = await api(page, 'POST', 'workflows?module=tickets&departmentId=' + D, b); out.r.push(r.s + ' ' + r.t.slice(0, 260)); if (r.s < 300) { out.ok = r.t.slice(0, 600); break; }
  const m = (r.t.match(/extra parameter '([^']+)'/) || [])[1]; if (m) { const strip = o => { if (Array.isArray(o)) return o.map(strip); if (o && typeof o === 'object') { const c = {}; for (const [kk, v] of Object.entries(o)) if (kk !== m) c[kk] = strip(v); return c; } return o; }; b = strip(b); continue; } break; }
