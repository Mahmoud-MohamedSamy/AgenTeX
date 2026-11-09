// NDC-2412 confirm after a fresh U2 sign-in (Manager @team1), then restore U2 to User @team2.
const id1 = '6986f117-1032-4ec6-aea4-bd5ad2298b91';
const me = (await api('u2', 'GET', '/iam/me')).j?.data;
const g = (await api('u2', 'GET', `/modules/${T.LEADS}/records/${id1}`)); const list = arr((await api('u2', 'GET', `/modules/${T.LEADS}/records?page=1`)).j?.data).map(x => x.id);
const back = (await api('o', 'POST', `/iam/users/${T.U2}/profiles`, { profile_id: T.P_USER, scope_id: T.OU_TEAM2, replace: true })).s;
ledger(`user U2 restored to User @ team2: ${back}`);
return { profiles: (me?.profiles || []).map(p => p.name + '@' + p.scope_id), open: g.s, body: g.t.slice(0, 200), listCount: list.length, inList: list.includes(id1), restore: back };
