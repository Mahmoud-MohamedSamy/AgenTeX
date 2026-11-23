const a = await api('GET', '/desk/agents/me/departments');
const L = arr(a.j?.data ?? a.j);
const t = await api('GET', '/desk/tickets?limit=5');
return { s: a.s, deps: L.map(d => (d.name || d.department_name) + ':' + (d.id || d.department_id)), tickets_s: t.s, total: t.j?.meta?.total ?? t.j?.data?.total };
