const o = JSON.parse(fs.readFileSync('../a4/d6.json'));
const f = arr((await api('GET', `/modules/${o.module}/fields?take=200`)).j?.data); log(Object.keys(f[0]).join(','));
log(JSON.stringify(f.map(x => Object.fromEntries(Object.entries(x).filter(([k, v]) => typeof v !== 'object' && /name|key|type|system|kind/i.test(k))))));
