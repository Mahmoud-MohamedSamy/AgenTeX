const me = D((await api('GET', '/iam/me')).j) || {}; out.keys = Object.keys(me); out.profile = JSON.stringify(me.profile || me.profiles || me.role || me.roles || '').slice(0, 300);
const perms = me.permissions || me.effective_permissions || me.scopes || []; out.nPerms = Array.isArray(perms) ? perms.length : typeof perms;
out.relevant = (Array.isArray(perms) ? perms : Object.keys(perms || {})).filter(p => /archiv|ticket.?setting|parent|spam|settings|admin|manage/i.test(typeof p === 'string' ? p : JSON.stringify(p))).slice(0, 40);
for (const p of ['/iam/me/permissions', '/iam/permissions/me', '/iam/me/effective-permissions']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 200); }
return fin({ out });
