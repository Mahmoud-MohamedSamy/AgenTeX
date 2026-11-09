// NDC-2414: does the Desk Administrator profile (app desk) grant CRM metadata.records.view_all?
// (1) profile permission lists; (2) U2 (CRM User @ team2) + Desk Administrator added → U2's effective view_all + can U2 open U1's lead 6986f117 / see it listed;
// (3) restore U2 to exactly User @ team2.
const out = {}; const L1 = '6986f117-1032-4ec6-aea4-bd5ad2298b91';
const perms = async id => { const r = await api('o', 'GET', `/iam/profiles/${id}/permissions`); const t = r.t; return { s: r.s, viewAll: t.includes('metadata.records.view_all'), n: (t.match(/"[a-z]+[.:][\w.:]+"/g) || []).length }; };
out.deskAdmin = await perms(T.P_DESKADMIN); out.crmUser = await perms(T.P_USER); out.crmSupervisor = await perms(T.P_SUPERVISOR); out.crmAdmin = await perms(T.P_ADMIN);
const me = async () => { const t = (await api('u2', 'GET', '/iam/me/permissions')).t; return { viewAll: t.includes('metadata.records.view_all'), desk: (t.match(/"desk[:.][\w:.]+"/g) || []).length }; };
const see = async () => ({ open: (await api('u2', 'GET', `/modules/${T.LEADS}/records/${L1}`)).s, listed: arr((await api('u2', 'GET', `/modules/${T.LEADS}/records?page=1`)).j?.data).some(x => x.id === L1), total: arr((await api('u2', 'GET', `/modules/${T.LEADS}/records?page=1`)).j?.data).length });
out.before = { ...(await me()), ...(await see()) };
ledger(`user U2 ${T.U2}: Desk Administrator added for NDC-2414 — restore to User @ team2`);
try {
  const add = await api('o', 'POST', `/iam/users/${T.U2}/profiles`, { profile_id: T.P_DESKADMIN, scope_id: T.OU_TEAM2, replace: false });
  out.addDesk = add.s + (add.s > 299 ? ' ' + add.t.slice(0, 200) : '');
  await sleep(4000);
  out.profilesNow = arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).find(u => u.userId === T.U2)?.profileNames;
  out.withDesk = { ...(await me()), ...(await see()) };
} finally {
  out.restore = (await api('o', 'POST', `/iam/users/${T.U2}/profiles`, { profile_id: T.P_USER, scope_id: T.OU_TEAM2, replace: true })).s;
  const u = arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).find(x => x.userId === T.U2); out.restored = u?.profileNames + ' @' + (u?.orgUnitId === T.OU_TEAM2 ? 'team2' : u?.orgUnitId);
  ledger(`user U2 restored: ${out.restored}`);
}
return out;
