const pr = arr((await api('GET', '/iam/profiles?app_key=desk')).j?.data); const sup = pr.find(p => /^Desk Supervisor$/i.test(p.name));
const pid = sup?.profileId; const perms = arr((await api('GET', `/iam/profiles/${pid}/permissions`)).j?.data).map(x => x.permissionKey);
const users = arr((await api('GET', '/iam/users?take=300&app_key=desk')).j?.data).filter(u => (u.profileNames || '').split(', ').includes('Desk Supervisor')).map(u => u.displayName + ':' + u.status);
return { pid, users, n: perms.length, ai: perms.filter(k => /^ai:/.test(k)), profileView: perms.filter(k => /profile/i.test(k)), settings: perms.filter(k => /setting/i.test(k)).slice(0, 8) };
