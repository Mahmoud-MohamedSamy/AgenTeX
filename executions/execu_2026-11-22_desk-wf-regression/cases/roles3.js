const out = {};
for (const p of ['/iam/profiles?app_key=desk', '/iam/profiles', '/iam/roles?app_key=desk']) { const r = await api('GET', p); const a = arr(r.j?.data?.items || r.j?.data); out[p] = r.s + ' ' + a.slice(0, 12).map(x => (x.name || x.displayName) + '=' + String(x.id || x.profileId || x.roleId).slice(0, 8) + (x.app_key ? '/' + x.app_key : '')).join(', '); }
const orgs = arr((await api('GET', '/iam/org-units?take=500')).j?.data); out.orgUnits = orgs.map(o => (o.name) + '=' + (o.orgUnitId || o.id).slice(0, 8) + ' ' + (o.app_key || '') + ' ' + o.path).slice(0, 15);
const us = arr((await api('GET', '/iam/users?take=200&app_key=desk')).j?.data);
out.deptB = ['5491656d', '876ce871', '97be04b6'].map(p => { const u = us.find(x => x.userId.startsWith(p)); return u && (u.displayName + ' | role ' + u.orgUnitId.slice(0, 8) + ' | profile ' + JSON.stringify(u.profileNames) + ' | ' + u.status); });
out.supervisorEmailsDomains = us.filter(u => u.orgUnitId.startsWith('685c01ab')).map(u => u.displayName + ' @' + (u.email || '').split('@')[1]);
const tl = (await api('GET', '/desk/email-templates')).j?.data?.email_templates || []; out.templates = tl.map(t => t.name + ' [' + t.notification_type + '/' + t.module + (t.is_system ? '/system' : '') + ']').slice(0, 20);
return out;
