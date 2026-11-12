const out = {}; const p = arr((await api('GET', '/iam/profiles')).j.data).find(x => x.name === P + ' prof'); out.p = JSON.stringify(p); return out;
