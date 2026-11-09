// NDC-2412 confirm: U2 Manager @team1 — check me profiles, wait, recheck. Leaves U2 as Manager @team1 for the fresh-sign-in check (restored in r9-2412c).
const id1 = '6986f117-1032-4ec6-aea4-bd5ad2298b91';
const s = (await api('o', 'POST', `/iam/users/${T.U2}/profiles`, { profile_id: T.P_MANAGER, scope_id: T.OU_TEAM1, replace: true })).s;
ledger(`user U2 set to Manager @ team1 for NDC-2412 confirmation (restore to User @ team2)`);
const me = (await api('u2', 'GET', '/iam/me')).j?.data; log('set', s, 'me.profiles', (me?.profiles || []).map(p => p.name + '@' + p.scope_id));
const g0 = (await api('u2', 'GET', `/modules/${T.LEADS}/records/${id1}`)).s; await sleep(60000);
const g1 = (await api('u2', 'GET', `/modules/${T.LEADS}/records/${id1}`)).s;
return { g0, g1 };
