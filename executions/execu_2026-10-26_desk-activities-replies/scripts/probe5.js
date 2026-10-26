// Read-only: users list (emails) and department membership
const out = {};
const d = ((await api('GET', '/desk/departments')).j || {}).data || [];
const ids = [...new Set(d.flatMap(x => x.agent_user_ids || []))];
let u = null; for (const p of ['/users?page=1&page_size=200', '/users', '/iam/users', '/org/users', '/user-management/users']) { const r = await api('GET', p); if (r.s === 200) { u = { p, j: r.j }; break; } }
const L = u ? (Array.isArray(u.j.data) ? u.j.data : (u.j.data.users || u.j.data.items || [])) : [];
out.src = u && u.p; out.sample = JSON.stringify(L[0]).slice(0, 500); out.n = L.length;
out.members = ids.map(id => { const x = L.find(y => [y.id, y.user_id, y.userId, y.iam_user_id].includes(id)) || {}; return { id, email: x.email, name: x.display_name || x.name || ((x.first_name || '') + ' ' + (x.last_name || '')), depts: d.filter(z => (z.agent_user_ids || []).includes(id)).map(z => z.name) }; });
return done(out);
