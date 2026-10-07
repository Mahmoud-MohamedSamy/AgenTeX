// Read-only: what the agent session's token actually allows.
const p = await api('GET', '/iam/me/permissions'); const s = JSON.stringify(p.j);
const keys = (s.match(/"metadata[.:][a-z_.:]+"/g) || []);
const me = await api('GET', '/iam/me'); const apps = await api('GET', '/iam/me/apps');
page.off('request', onReq);
return JSON.stringify({ status: p.s, metadataKeys: [...new Set(keys)], deskKeysCount: (s.match(/"desk:[a-z_:]+"/g) || []).length, me: (me.t || '').replace(/"[a-z0-9._-]+@[a-z0-9.-]+"/gi, '"<email>"').slice(0, 400), apps: apps.t.slice(0, 300) });
