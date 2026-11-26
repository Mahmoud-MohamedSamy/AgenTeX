const B = JSON.parse(fs.readFileSync(RUN + '/out/ss-baseline.json', 'utf8')); const c = (await api('GET', '/agents/runtime-settings')).j?.data;
const r = await api('PUT', '/agents/runtime-settings', { tia_strong_steps_per_user_daily: 10, tia_strong_steps_per_workspace_daily: 100, expected_version: c.version });
const n = (await api('GET', '/agents/runtime-settings')).j?.data;
const diff = Object.keys(B).filter(k => k !== 'version' && JSON.stringify(B[k]) !== JSON.stringify(n[k])).map(k => k + ': ' + JSON.stringify(B[k]) + ' -> ' + JSON.stringify(n[k]));
fs.writeFileSync(RUN + '/out/ss-repro.json', JSON.stringify({ before: c, after: n, diff }, null, 1));
const body = { ...B }; delete body.version; body.expected_version = n.version; const rr = await api('PUT', '/agents/runtime-settings', body); const f = (await api('GET', '/agents/runtime-settings')).j?.data;
const left = Object.keys(B).filter(k => k !== 'version' && JSON.stringify(B[k]) !== JSON.stringify(f[k]));
ledger(`SS repro partial save (same values): diff=${JSON.stringify(diff)}; restored ${rr.s} left=${JSON.stringify(left)} v${f.version}`); return { put: r.s, diff, restore: rr.s, left };
