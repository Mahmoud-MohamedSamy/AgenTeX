const me = await api('GET', '/iam/me'); const apps = await api('GET', '/iam/me/apps');
return done({ me: me.s, profiles: (me.j?.data?.profiles || []).map(p => p.name), apps: apps.s + ' ' + apps.t.slice(0, 400) });
