const d = await api('GET', '/desk/departments?page_size=200'); const ds = L(d.j?.data);
const u = await api('GET', '/iam/users?app_key=desk&page_size=500&page=1'); const us = L(u.j?.data); const nm = id => (us.find(x => x.userId === id) || {}).displayName || id.slice(0, 8);
return { users: [AG_A, '7e5e7c27-46e4-4bf6-b021-7bd219d34472', OWNER].map(id => { const x = us.find(y => y.userId === id) || {}; return [id.slice(0, 8), x.displayName, x.status, JSON.stringify(x.profileNames)].join(' | '); }),
 deps: ds.filter(x => /QA/.test(x.name)).map(x => [x.id.slice(0, 8), x.name, x.is_active, (x.agent_user_ids || []).map(nm).join(','), 'VO:' + (x.view_only_agent_user_ids || []).map(nm).join(',')].join(' | ')).slice(0, 40) };
