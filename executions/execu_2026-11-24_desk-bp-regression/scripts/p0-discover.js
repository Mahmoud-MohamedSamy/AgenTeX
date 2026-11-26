// Phase 0 discovery (read-only): all workflow rules, department/team shapes, Desk users + profiles + roles.
const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const rules = []; for (let skip = 0; skip < 2000; skip += 100) { const a = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); rules.push(...a); if (a.length < 100) break; }
const active = rules.filter(r => r.isActive ?? r.is_active);
const o = { rules: rules.length, active: active.map(r => `${String(r.id).slice(0, 8)} ${r.name} | depts:${(r.departmentIds || []).length || 'ALL'} | ${r.trigger?.kind}`) };
const deps = arr((await api('GET', '/desk/departments')).j?.data);
const cs = deps.find(d => d.name === 'Customer Support');
const one = (await api('GET', '/desk/departments/' + cs.id)).j?.data;
o.deptKeys = Object.keys(one); o.deptSample = Object.fromEntries(Object.entries(one).map(([k, v]) => [k, Array.isArray(v) ? `[${v.length}]` : (v && typeof v === 'object') ? '{' + Object.keys(v).join(',') + '}' : v]));
const teams = arr((await api('GET', '/desk/teams')).j?.data); o.teamKeys = teams[0] ? Object.keys(teams[0]) : []; o.teamCount = teams.length;
const users = arr((await api('GET', '/iam/users?app_key=desk&page_size=200')).j?.data);
const want = /fedelav803|kinase5517|pacox68754|mahmoud\.mohamed2|mahmoud\.mahamed1515|ces|light|view/i;
o.users = users.filter(u => want.test((u.email || '') + ' ' + (u.displayName || u.name || ''))).map(u => ({ id: u.id || u.userId, name: u.displayName || u.name || ((u.firstName || '') + ' ' + (u.lastName || '')), mail: (u.email || '').replace(/^(.{3}).*@/, '$1…@'), profile: u.profileName || u.profile?.name || u.profile_name, role: u.roleName || u.role?.name, status: u.status }));
o.userKeys = users[0] ? Object.keys(users[0]) : [];
o.profiles = arr((await api('GET', '/iam/profiles?app_key=desk')).j?.data).map(p => `${p.profileId || p.id} ${p.name}`);
fs.writeFileSync('../baseline/discover.json', JSON.stringify({ rules, dept: one, teamSample: teams[0], users }, null, 1));
return o;
