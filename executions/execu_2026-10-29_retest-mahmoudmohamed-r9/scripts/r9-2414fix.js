// Restore U2: remove the Desk Administrator profile added for NDC-2414; verify profiles = User @ team2 and no view_all.
const out = {};
out.remove = (await api('o', 'DELETE', `/iam/users/${T.U2}/profiles/${T.P_DESKADMIN}?scopeId=${T.OU_TEAM2}`)).s;
await sleep(3000);
const u = arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).find(x => x.userId === T.U2); out.profiles = u?.profileNames + ' @' + (u?.orgUnitId === T.OU_TEAM2 ? 'team2' : u?.orgUnitId);
out.viewAll = (await api('u2', 'GET', '/iam/me/permissions')).t.includes('metadata.records.view_all');
ledger(`user U2 Desk Administrator removed: ${out.profiles}`);
return out;
