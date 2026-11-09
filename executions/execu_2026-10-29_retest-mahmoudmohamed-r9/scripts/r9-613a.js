// NDC-613 step 1: control (U1 list/export before), then deny view self/team/all on U1 (overrides removed in r9-613c).
const K = ['iam.security.loginhistory.view_self', 'iam.security.loginhistory.view_team', 'iam.security.loginhistory.view_all'];
const out = { listBefore: (await api('u1', 'GET', '/audit/login-history?limit=5')).s, exportBefore: (await api('u1', 'GET', '/audit/login-history/export')).s };
out.overridesBefore = (await api('o', 'GET', `/iam/users/${T.U1}/overrides`)).t.slice(0, 200);
for (const k of K) { const r = await api('o', 'POST', `/iam/users/${T.U1}/overrides`, { permission_key: k, effect: 'deny', reason: 'QA RT 613 retest' }); out[k] = r.s + (r.s > 299 ? ' ' + r.t.slice(0, 200) : ''); if (r.s < 300) ledger(`override deny ${k} on U1 ${T.U1} (NDC-613) — remove`); }
return out;
