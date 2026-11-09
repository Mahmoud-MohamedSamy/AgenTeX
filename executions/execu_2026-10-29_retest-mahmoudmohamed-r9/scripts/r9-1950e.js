// NDC-1950 wrap-up: remove U1's crm.page.my_requests.view grant; deactivate the QA approval process and the QA review process.
const out = {};
out.revoke = (await api('o', 'DELETE', `/iam/users/${T.U1}/overrides/crm.page.my_requests.view?reason=QA%20RT%201950`)).s;
out.u1Overrides = (await api('o', 'GET', `/iam/users/${T.U1}/overrides`)).t.slice(0, 80);
out.apOff = (await api('o', 'PATCH', '/workflow/approval-processes/ee466144-6673-4d7a-abe0-6c78ed99c264/active', { isActive: false })).s;
out.rpOff = (await api('o', 'PATCH', '/workflow/review-processes/bd081d46-b273-4579-9025-8c6e12c51219/active', { isActive: false, pendingAction: 'reject_all' })).s;
ledger(`NDC-1950 wrap-up: U1 grant removed (${out.revoke}), approval ee466144 off (${out.apOff}), review bd081d46 off (${out.rpOff})`);
return out;
