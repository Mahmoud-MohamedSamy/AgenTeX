const o = {}; const n = r => { const d = r.j?.data; const a = arr(d); return r.s + ':' + (Array.isArray(d) || a.length ? a.length : (d?.total ?? JSON.stringify(d).slice(0, 60))); };
const P = process.env.APP === 'crm' ? ['/approval-processes', '/approvals/processes', '/approval/processes', '/scoring-rules', '/scoring/rules', '/lead-scoring/rules', '/blueprints', '/assignment-rules'] : ['/assignment-rules', '/desk/assignment-rules', '/assignment/rules', '/blueprints', '/desk/blueprints', '/sla/policies', '/desk/sla-policies', '/sla-policies'];
for (const p of P) o[p] = n(await api('GET', p + '?limit=100'));
return o;
