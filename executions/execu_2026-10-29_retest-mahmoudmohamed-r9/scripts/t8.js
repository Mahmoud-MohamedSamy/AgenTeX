const users = arr((await api('GET', '/iam/users?app_key=crm&limit=100')).j?.data).map(u => u.email + ' → ' + u.profileNames);
const listed = arr((await api('GET', '/teamspaces')).j?.data).map(t => t.id.slice(0, 8) + ' ' + t.name + ' mode=' + t.accessMode + ' canManage=' + t.canManage);
return done({ users, listedForMe: listed });
