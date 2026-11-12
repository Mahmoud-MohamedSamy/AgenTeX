// Cleanup of TAVI objects listed in ledger.md (by id only). Order: tickets, rules, skills, skill types, departments.
// Departments: remove agents, then delete with transfer of leftover (recycle-bin) tickets to QA AO Dept B.
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', HOLD = '4853562a-0b4d-45cb-ba34-9f2118fcd32c';
const lines = fs.readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/ledger.md', 'utf8').split('\n').filter(l => / TAVI /.test(l));
const items = {}; const re = /TAVI (\w+) (.*?) ([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
for (const l of lines) { const m = l.match(re); if (m) (items[m[1]] = items[m[1]] || new Map()).set(m[3], m[2]); }
const out = { deleted: {}, failed: [] };
const del = async (kind, path, id, name) => { const r = await api('DELETE', path); if ((r.s >= 200 && r.s < 300) || r.s === 404) { out.deleted[kind] = (out.deleted[kind] || 0) + 1; } else out.failed.push([kind, name, id, r.s, r.t.slice(0, 160)]); };
for (const [id, n] of items.ticket || []) await del('ticket', `/modules/${TK}/records/${id}`, id, n);
for (const [id, n] of items.assignmentRule || []) await del('rule', `/desk/assignment-rules/${id}`, id, n);
for (const [id, n] of items.skill || []) await del('skill', `/desk/skills/${id}`, id, n);
for (const [id, n] of items.skillType || []) await del('skillType', `/desk/skill-types/${id}`, id, n);
for (const [id, n] of items.department || []) {
  const g = await api('GET', `/desk/departments/${id}`);
  if (g.s === 404) { out.deleted.department = (out.deleted.department || 0) + 1; continue; }
  await api('PATCH', `/desk/departments/${id}`, { name: g.j.data.name, agent_user_ids: [] });
  await del('department', `/desk/departments/${id}?transfer_to_department_id=${HOLD}`, id, n);
}
// verify
const left = [];
for (const [id, n] of items.department || []) { const g = await api('GET', `/desk/departments/${id}`); if (g.s !== 404) left.push(['department', n, g.s]); }
for (const [id, n] of items.ticket || []) { const g = await api('GET', `/modules/${TK}/records/${id}`); if (g.s === 200 && !g.j?.data?.is_deleted) left.push(['ticket', n, g.s]); }
out.stillThere = left;
return out;
