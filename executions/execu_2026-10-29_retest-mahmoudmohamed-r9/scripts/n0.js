// Round 9 inventory of the Anyware tenant (read-only): me, org, users + profiles/roles, roles tree, profiles, hierarchy pref.
await page.goto(H + '/', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {}); await sleep(4000);
const me = (await api('GET', '/iam/me')).j?.data;
const users = arr((await api('GET', '/iam/users?app_key=crm&limit=100')).j?.data).map(u => ({ e: u.email, id: u.id || u.user_id, st: u.status, prof: u.profile?.name || u.profileName || (u.profiles||[]).map(p=>p.name||p).join('/'), role: u.role?.name || u.roleName, dept: u.department?.name || u.departmentName }));
const roles = (await api('GET', '/iam/roles?limit=100')); const profiles = (await api('GET', '/iam/profiles?app_key=crm&limit=100'));
const depts = (await api('GET', '/iam/departments?limit=100'));
return done({ me: { email: me?.email, org: me?.organization?.name || me?.org_name || me?.tenant?.name, orgId: me?.organization_id || me?.org_id }, users,
  roles: [roles.s, arr(roles.j?.data).map(r => [r.name, r.id, r.parentId || r.parent_id || r.reportsTo])],
  profiles: [profiles.s, arr(profiles.j?.data).map(p => [p.name, p.id])], depts: [depts.s, arr(depts.j?.data).map(d => [d.name, d.id])],
  meKeys: Object.keys(me || {}).slice(0, 40), u0Keys: Object.keys(arr((await api('GET', '/iam/users?app_key=crm&limit=1')).j?.data)[0] || {}) });
