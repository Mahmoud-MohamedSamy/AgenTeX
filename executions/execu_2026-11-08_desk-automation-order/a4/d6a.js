const ts = arr((await api('GET', '/teamspaces')).j?.data); log('teamspaces', JSON.stringify(ts.map(t => ({ id: t.id, n: t.name || t.label, app: t.appKey || t.app_key }))).slice(0, 600));
