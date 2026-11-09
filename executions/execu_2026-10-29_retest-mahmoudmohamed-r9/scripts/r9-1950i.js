const out = {};
out.managerCleared = (await api('o', 'PATCH', `/iam/users/${T.U1}/reporting-manager`, { reporting_manager_id: null })).s;
out.revokeU2 = (await api('o', 'DELETE', `/iam/users/${T.U2}/overrides/crm.page.my_requests.view?reason=QA%20RT%201950`)).s;
const u = arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).find(x => x.userId === T.U1); out.u1Manager = u?.reportingManagerId ?? null;
out.u2Overrides = (await api('o', 'GET', `/iam/users/${T.U2}/overrides`)).t.slice(0, 80);
ledger(`NDC-1950 middle tier undone: U1 manager ${out.u1Manager}, U2 grant removed (${out.revokeU2})`);
return out;
