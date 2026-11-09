// NDC-1950 middle tier: U1 reports to U2; U2 granted the My Requests page (both undone in r9-1950i).
const out = {};
out.manager = (await api('o', 'PATCH', `/iam/users/${T.U1}/reporting-manager`, { reporting_manager_id: T.U2 })).s;
out.grantU2 = (await api('o', 'POST', `/iam/users/${T.U2}/overrides`, { permission_key: 'crm.page.my_requests.view', effect: 'GRANT', reason: 'QA RT 1950 middle tier' })).s;
ledger(`U1 reporting manager set to U2 + GRANT crm.page.my_requests.view on U2 (NDC-1950 middle tier) — undo`);
out.u1Mgr = arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).find(u => u.userId === T.U1)?.reportingManagerId === T.U2;
return out;
