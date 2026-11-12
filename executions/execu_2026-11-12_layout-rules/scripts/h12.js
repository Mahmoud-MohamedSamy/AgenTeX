const b = JSON.parse(fs.readFileSync(RUN + '/out/hc-access-before.json', 'utf8')); const a = (await api('GET', '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389')).j.data.access;
const diff = Object.keys({ ...a, ...b }).filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k])); return { mode: a.mode, accessDiffVsBackup: diff };
