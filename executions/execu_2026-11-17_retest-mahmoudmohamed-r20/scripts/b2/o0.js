const d = await api('GET', '/desk/departments/' + CS); const g = d.j?.data || {};
const u = await api('GET', '/iam/users?app_key=desk&page_size=500&page=1'); const us = L(u.j?.data);
const x = us.find(y => y.userId === AG_A) || {};
return { cs: d.s, csHasA: (g.agent_user_ids || []).includes(AG_A), csVO: (g.view_only_agent_user_ids || []).length, csVOhasA: (g.view_only_agent_user_ids || []).includes(AG_A), a: [x.displayName, x.status, JSON.stringify(x.profileNames)] };
