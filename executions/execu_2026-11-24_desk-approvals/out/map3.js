const o = {};
o.settings = (await api('GET', '/desk/settings/approvals')).t.slice(0, 800);
o.count = (await api('GET', '/desk/approvals/count')).t.slice(0, 300);
const d = await api('GET', '/desk/departments?limit=200'); o.depts = arr(d.j?.data?.departments || d.j?.data).map(x => x.name + ' | ' + x.id + ' | agents:' + (x.agent_count ?? x.agents?.length ?? '?'));
const a = await api('GET', '/desk/agents?limit=200'); o.agentsStatus = a.s; o.agents = arr(a.j?.data?.agents || a.j?.data).map(x => [x.name || x.display_name || ((x.first_name||'')+' '+(x.last_name||'')), x.id, x.user_id, x.role || x.profile?.name || x.profile_name, (x.departments || x.department_ids || []).map(y => y.name || y).join('/') , x.status].join(' | '));
return o;
