// NDC-2414 detail: with Desk Administrator added, where does metadata.records.view_all sit in U2's effective permissions (which app)?
// Does it open CRM records it otherwise can't (U1's lead, an owner lead)? Desk Administrator removed again at the end.
const out = {}; const L1 = '6986f117-1032-4ec6-aea4-bd5ad2298b91';
const ctx = t => { const i = t.indexOf('metadata.records.view_all'); return i < 0 ? null : t.slice(Math.max(0, i - 260), i + 60); };
const ol = (await X.lead('o', 'QA RT 2414 owner lead')).j?.data?.id; out.ownerLead = ol;
const probe = async () => ({ u1Lead: (await api('u2', 'GET', `/modules/${T.LEADS}/records/${L1}`)).s, ownerLead: (await api('u2', 'GET', `/modules/${T.LEADS}/records/${ol}`)).s, listOwner: arr((await api('u2', 'GET', `/modules/${T.LEADS}/records?page=1`)).j?.data).some(x => x.id === ol) });
out.before = await probe();
try {
  out.add = (await api('o', 'POST', `/iam/users/${T.U2}/profiles`, { profile_id: T.P_DESKADMIN, scope_id: T.OU_TEAM2, replace: false })).s; await sleep(4000);
  const p = await api('u2', 'GET', '/iam/me/permissions'); out.permsShape = JSON.stringify(p.j?.data && (Array.isArray(p.j.data) ? 'array' : Object.keys(p.j.data))).slice(0, 200);
  out.viewAllContext = ctx(p.t);
  const crm = await api('u2', 'GET', '/iam/me/permissions?app_key=crm'); out.crmScoped = crm.s + ' viewAll=' + crm.t.includes('metadata.records.view_all');
  const me = (await api('u2', 'GET', '/iam/me')).j?.data; out.profilesByApp = JSON.stringify(me?.profiles_by_app).slice(0, 300);
  out.withDesk = await probe();
  const dp = await api('o', 'GET', `/iam/profiles/${T.P_DESKADMIN}/permissions?limit=500`); out.deskProfileHasViewAll = dp.t.includes('view_all') ? (dp.t.match(/[\w.:]*view_all[\w.:]*/g) || []).filter((v, i, a) => a.indexOf(v) === i) : 'no view_all key';
} finally {
  out.remove = (await api('o', 'DELETE', `/iam/users/${T.U2}/profiles/${T.P_DESKADMIN}?scopeId=${T.OU_TEAM2}`)).s; await sleep(2000);
  const u = arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).find(x => x.userId === T.U2); out.restored = u?.profileNames + ' @' + (u?.orgUnitId === T.OU_TEAM2 ? 'team2' : u?.orgUnitId);
}
return out;
