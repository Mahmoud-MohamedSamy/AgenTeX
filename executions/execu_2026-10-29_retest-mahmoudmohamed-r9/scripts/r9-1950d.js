// NDC-1950 regular-user tier: grant U1 crm.page.my_requests.view (removed in r9-1950e) + one lead of U1 pending approval.
const out = {};
out.grant = (await api('o', 'POST', `/iam/users/${T.U1}/overrides`, { permission_key: 'crm.page.my_requests.view', effect: 'GRANT', reason: 'QA RT 1950 regular-user tier' })).s;
ledger(`override GRANT crm.page.my_requests.view on U1 (NDC-1950) — remove`);
const l = (await X.lead('u1', 'QA RT 1950 A u1 own')).j?.data?.id; out.u1Lead = l; await sleep(6000);
out.state = (await X.approvalState('o', T.LEADS, l)).j?.data?.state;
return out;
