const res = {};
for (const id of ['9b2fb806-2609-43f3-a08d-80e1e2d4c244', 'acd6d2b8-5742-4342-b190-0fb5573b7ccf']) {
  const r = await call('GET', `/workflow/approvals/records/841043e1-c078-41f9-8d6e-dfd61bee45c3/${id}`);
  const d = r.j && r.j.data || {};
  res[id] = { s: r.s, state: d.state, inst: d.instanceId, canApprove: d.canApprove, canReject: d.canReject, admin: d.isProcessAdmin, why: d.viewerDecisionBlockedReason, approvers: JSON.stringify(d.currentApprovers || d.approvers || '').slice(0, 200) };
}
return res;
