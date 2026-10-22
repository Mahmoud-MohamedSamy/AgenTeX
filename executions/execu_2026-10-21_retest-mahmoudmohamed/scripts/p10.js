const r = await api('GET', '/iam/users?limit=100');
const x = arr(r.j.data).find(x => /nameb56175/.test(x.email || ''));
return done({ keys: Object.keys(x), x: JSON.stringify(x).slice(0, 400) });
