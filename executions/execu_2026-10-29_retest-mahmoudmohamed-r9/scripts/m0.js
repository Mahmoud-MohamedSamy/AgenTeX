const mods = arr((await api('GET', '/modules')).j?.data).map(m => [m.apiName || m.api_name || m.key, m.id, m.name || m.label?.en]).filter(x => /lead|deal|contact|account|test|partner|qa/i.test(x.join(' ')));
const users = arr((await api('GET', '/iam/users?app_key=crm&limit=100')).j?.data).map(u => [u.email, u.id || u.user_id, u.status, (u.profiles || u.profile_names || []).toString().slice(0, 60)]);
const me = (await api('GET', '/iam/me')).j?.data;
const perms = (await api('GET', '/iam/me/permissions')).j?.data; const plist = Array.isArray(perms) ? perms : (perms?.permissions || perms?.keys || []);
return done({ mods, users, me: me?.user_id, reviewView: JSON.stringify(plist).includes('workflow:review:view'), nPerms: plist.length });
