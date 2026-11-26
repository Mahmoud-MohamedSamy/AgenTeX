const B = JSON.parse(fs.readFileSync(RUN + '/out/ss-baseline.json', 'utf8')); const c = (await api('GET', '/agents/runtime-settings')).j?.data;
const body = { ...B }; delete body.version; body.expected_version = c.version;
const r = await api('PUT', '/agents/runtime-settings', body); const n = (await api('GET', '/agents/runtime-settings')).j?.data;
const diff = Object.keys(B).filter(k => k !== 'version' && JSON.stringify(B[k]) !== JSON.stringify(n[k])).map(k => k + ': ' + JSON.stringify(B[k]) + ' -> ' + JSON.stringify(n[k]));
ledger('SS runtime-settings full restore ' + r.s + ' diff=' + JSON.stringify(diff) + ' v' + n.version); return { s: r.s, err: r.s >= 300 ? r.t.slice(0, 300) : undefined, ver: n.version, diff };
