const pr = arr((await api('GET', '/iam/profiles?app_key=crm')).j?.data);
const out = { profiles: pr.map(p => p.name).slice(0, 30) };
const ca = pr.find(p => /^CRM Admin/i.test(p.name)) || pr.find(p => /admin/i.test(p.name) && !/desk/i.test(p.name));
out.keys = Object.keys(ca||{}); const cid = ca && (ca.id || ca.profileId || ca.profile_id); out.crmAdmin = ca && { id: cid, name: ca.name, isSystem: ca.isSystem ?? ca.is_system ?? ca.builtIn };
if (ca) { const g = arr((await api("GET", `/iam/profiles/${cid}/permissions`)).j?.data); out.hasTia = g.some(x => x.permissionKey === 'ai:tia:use'); out.aiKeys = g.map(x => x.permissionKey).filter(k => /^ai:/.test(k)); out.permCount = g.length; }
const own = pr.find(p => /^(Owner|Administrator|Admin)$/i.test(p.name)); if (own) { const g = arr((await api('GET', `/iam/profiles/${own.id}/permissions`)).j?.data); out.other = { name: own.name, hasTia: g.some(x => x.permissionKey === 'ai:tia:use'), n: g.length }; }
const users = arr((await api('GET', '/iam/users?take=300&app_key=crm')).j?.data);
out.crmAdminOnly = users.filter(u => (u.profileNames || '').split(', ').filter(Boolean).every(n => /^CRM Admin/i.test(n)) && (u.profileNames || '')).map(u => u.displayName + ':' + u.status + ':' + u.profileNames);
return out;
