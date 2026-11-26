const u = await api('GET', '/iam/users?take=300&app_key=desk'); const us = arr(u.j?.data?.users || u.j?.data?.items || u.j?.data);
const p = await api('GET', '/iam/profiles?app_key=desk'); const ps = arr(p.j?.data?.profiles || p.j?.data?.items || p.j?.data);
const perms = JSON.stringify(p.j).match(/"[a-z_.:]*approv[a-z_.:]*"/gi);
return { users: us.map(x => x.displayName + ' | ' + JSON.stringify(x.profileNames) + (x.isOwner ? ' OWNER' : '')), profiles: p.s + ' ' + ps.map(x => (x.name) + ' | ' + x.id + ' | users:' + (x.user_count ?? x.userCount ?? '?')).join(' ;; '), approvalPermKeys: [...new Set(perms || [])] };
