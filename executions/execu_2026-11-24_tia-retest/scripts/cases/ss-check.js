const B = JSON.parse(fs.readFileSync(RUN + '/out/ss-baseline.json', 'utf8')); const c = (await api('GET', '/agents/runtime-settings')).j?.data;
const diff = Object.keys(B).filter(k => k !== 'version' && JSON.stringify(B[k]) !== JSON.stringify(c[k])).map(k => k + ': ' + JSON.stringify(B[k]) + ' -> ' + JSON.stringify(c[k]));
return { ver: c.version, diff };
