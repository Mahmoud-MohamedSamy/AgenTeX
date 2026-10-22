const me = await api('GET', '/iam/me');
const ms = (await mods()).map(m => m.id + ' ' + m.moduleKey + ' ' + (m.labels?.en || ''));
const ts = arr((await api('GET', '/teamspaces')).j.data).map(t => t.id + ' ' + t.name);
return done({ me: me.j?.data?.email, profiles: (me.j?.data?.profiles || []).map(p => p.name), ms, ts });
