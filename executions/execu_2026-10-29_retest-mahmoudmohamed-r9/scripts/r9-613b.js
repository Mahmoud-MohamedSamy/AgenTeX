// NDC-613: export GRANTED + view self/team/all DENIED on U1 → list and export must both be refused. Then control without the denies.
const K = ['iam.security.loginhistory.view_self', 'iam.security.loginhistory.view_team', 'iam.security.loginhistory.view_all'];
const out = {}; const eff = async () => { const t = (await api('u1', 'GET', '/iam/me/permissions')).t; return (t.match(/iam\.security\.loginhistory\.[a-z_]+/g) || []).filter((v, i, a) => a.indexOf(v) === i); };
const g = await api('o', 'POST', `/iam/users/${T.U1}/overrides`, { permission_key: 'iam.security.loginhistory.export', effect: 'GRANT', reason: 'QA RT 613 retest' });
out.grantExport = g.s; if (g.s < 300) ledger(`override GRANT iam.security.loginhistory.export on U1 (NDC-613) — remove`);
await sleep(3000);
out.effectiveDenied = await eff();
out.listDenied = (await api('u1', 'GET', '/audit/login-history?limit=5')).s;
const ex = await api('u1', 'GET', '/audit/login-history/export'); out.exportDenied = ex.s + ' ' + (ex.s < 300 ? ex.t.length + ' bytes' : ex.t.slice(0, 200));
// control: lift the three denies, keep the grant → export should work
for (const k of K) out['clear ' + k] = (await api('o', 'DELETE', `/iam/users/${T.U1}/overrides/${k}?reason=QA%20RT%20613`)).s;
await sleep(3000);
out.effectiveControl = await eff();
out.listControl = (await api('u1', 'GET', '/audit/login-history?limit=5')).s;
const ex2 = await api('u1', 'GET', '/audit/login-history/export'); out.exportControl = ex2.s + ' ' + (ex2.s < 300 ? ex2.t.split('\n').length + ' lines' : ex2.t.slice(0, 200));
// put the denies back for the screen check (removed in r9-613c)
for (const k of K) out['deny again ' + k] = (await api('o', 'POST', `/iam/users/${T.U1}/overrides`, { permission_key: k, effect: 'DENY', reason: 'QA RT 613 retest' })).s;
return out;
