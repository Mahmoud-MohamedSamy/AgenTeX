const u = arr((await api('GET', '/iam/users?page_size=200')).j.data).filter(x => /mahmoud|tavi|owner/i.test((x.displayName || x.name || '') + ' ' + x.email));
rec('USERS', 'INFO', u.map(x => `${x.displayName || x.name || ''} <${x.email}> [${x.profileNames}]`).join(' ; '));
return done();
