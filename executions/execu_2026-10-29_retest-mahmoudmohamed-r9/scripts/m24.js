// NDC-2294 item 7: Everyone (parallel / sequential) for a role approver. Inactive QA processes, deleted right after.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', ME = '3445ec4a-020e-4f12-b156-dd2de7610164'; const out = {};
const sup = arr((await api('GET', '/iam/profiles')).j?.data).find(p => p.name === 'Supervisor')?.profileId; out.sup = sup;
const crit = { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'QA RT r8 APPR', caseInsensitive: false, negate: null };
const body = (approver, n) => ({ moduleId: L, name: 'QA RT r8 appr ' + n, description: null, executeOnCreate: true, executeOnEdit: false, isActive: false, priority: 10,
  admins: { adminUserIds: [ME], adminRoleIds: [], allowEdit: false, editScope: 'all_fields', notifyOriginalApproversEmail: false, notifyOriginalApproversInApp: false },
  rules: [{ criteria: crit, levels: [{ approver, waitingFieldAccess: { mode: 'none' }, afterStageUpdateFields: null, assignTask: null, assignToSubmitterManager: false }], finalActions: [], rejectionActions: [], rejectedFieldAccess: { mode: 'none' }, approvedFieldAccess: { mode: 'none' } }] });
for (const [k, mode] of [['role', 'everyone_parallel'], ['role', 'everyone_sequential'], ['role', 'anyone'], ['group', 'everyone_parallel'], ['users', 'everyone_parallel']]) {
  const r = await api('POST', '/workflow/approval-processes', body({ kind: k, values: [sup], mode }, k + ' ' + mode));
  const id = r.j?.data?.id; let stored = null; if (id) { const full = (await api('GET', '/workflow/approval-processes/' + id)).j?.data; stored = JSON.stringify(full?.rules?.[0]?.levels?.[0]).slice(0, 400); await api('DELETE', '/workflow/approval-processes/' + id); }
  out[k + ' ' + mode] = r.s + ' ' + (id ? 'stored ' + stored : r.t.slice(0, 260));
}
return done(out);
