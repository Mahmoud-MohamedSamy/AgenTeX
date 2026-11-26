const u = (await api('GET', '/iam/users/e82f62cb-9904-42c7-a13c-77a7449820b9')).j?.data; const before = u?.status;
const r = await api('PATCH', '/iam/users/e82f62cb-9904-42c7-a13c-77a7449820b9', { status: process.env.ST });
const a = (await api('GET', '/iam/users/e82f62cb-9904-42c7-a13c-77a7449820b9')).j?.data;
ledger('A-22: user QA Team 1 status ' + before + ' → ' + process.env.ST + ' (' + r.s + ')' + (process.env.ST === 'Suspended' ? ' — reactivate after' : ''));
return { before, patch: r.s, err: r.j?.error?.code, after: a?.status };
