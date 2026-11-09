// NDC-2708/2710 positive case: U1 granted workflow:approval:act (override, removed at the end); 5 new QA leads.
const out = {}; const G = 'QA RT 2708 ';
const g = await api('o', 'POST', `/iam/users/${T.U1}/overrides`, { permission_key: 'workflow:approval:act', effect: 'GRANT', reason: 'QA RT 2708 retest' }); out.grant = g.s + ' ' + (g.s > 299 ? g.t.slice(0, 200) : '');
if (g.s < 300) ledger(`override GRANT workflow:approval:act on U1 (NDC-2708) — removed in the same script`);
const apId = arr((await api('o', 'GET', '/workflow/approval-processes')).j?.data).find(a => a.name === G + 'approver U1')?.id;
await api('o', 'PATCH', `/workflow/approval-processes/${apId}/active`, { isActive: true }); await sleep(3000);
const rows = [];
try {
  for (let i = 1; i <= 5; i++) {
    const l = (await X.lead('o', G + 'act2 ' + i)).j?.data?.id; const rec = [], st = [];
    for (let k = 0; k < 3; k++) { rec.push((await api('u1', 'GET', `/modules/${T.LEADS}/records/${l}`)).s); const a = await X.approvalState('u1', T.LEADS, l); st.push(a.s + ':' + a.j?.data?.canApprove); await sleep(k ? 4000 : 1000); }
    const a = await X.approvalState('u1', T.LEADS, l); const r = await api('u1', 'POST', `/workflow/approvals/${a.j?.data?.instanceId}/approve`, { comment: 'QA RT 2708 approve' });
    const after = []; for (let k = 0; k < 3; k++) { const x = await X.approvalState('o', T.LEADS, l); const y = await X.approvalState('u1', T.LEADS, l); after.push('o ' + x.s + ':' + (x.j?.data?.state || x.t.slice(0, 80)) + ' / u1 ' + y.s + ':' + (y.j?.data?.state || y.t.slice(0, 80))); }
    rows.push({ l, rec, st, approve: r.s, after });
  }
} finally {
  out.inactive = (await api('o', 'PATCH', `/workflow/approval-processes/${apId}/active`, { isActive: false })).s;
  out.revoke = (await api('o', 'DELETE', `/iam/users/${T.U1}/overrides/workflow:approval:act?reason=QA%20RT%202708`)).s;
  out.overridesLeft = (await api('o', 'GET', `/iam/users/${T.U1}/overrides`)).t.slice(0, 120);
}
out.rows = rows; return out;
