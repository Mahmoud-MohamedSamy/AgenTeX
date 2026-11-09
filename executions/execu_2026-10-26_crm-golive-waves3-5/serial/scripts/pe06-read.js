const V = '51666421-12cb-426e-b91e-3003a2a1f923', out = {};
for (const app of ['crm', 'desk', '']) { const r = await call('GET', `/iam/users?${app ? 'app_key=' + app + '&' : ''}limit=200`); const l = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; const u = l.find(x => x.userId === V); out[app || 'all'] = u && (u.profileNames + ' @' + u.orgUnitId); }
const profs = (await call('GET', '/iam/profiles')).j.data; out.manager = profs.filter(p => p.name === 'Manager').map(p => (p.profileId || p.id) + ' ' + p.app_key);
const perms = (await call('GET', '/iam/profiles/11111111-1111-1111-1111-111111111105/permissions')).j.data;
out.keys = perms.map(p => p.permissionKey).filter(k => /profile|permission/i.test(k));
return out;
