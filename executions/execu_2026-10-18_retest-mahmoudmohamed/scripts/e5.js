const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const ME = '97be04b6-0a08-4883-aa51-e1650b11cab7'; const out = { tries: [] };
const body = mode => ({ moduleId: D, name: 'QA RT ap', description: 'QA retest NDC-1234 (temporary)', executeOnCreate: true, executeOnEdit: true, isActive: true,
  admins: { adminUserIds: [ME], adminRoleIds: [], allowEdit: false, editScope: 'all_fields', notifyOriginalApproversEmail: false, notifyOriginalApproversInApp: false },
  rules: [{ criteria: { kind: 'Comparison', field: 'deal_name', operator: 'StartsWith', value: { kind: 'string', stringValue: 'QA RT ap' } },
    levels: [{ approver: { kind: 'users', values: [ME] }, waitingFieldAccess: { mode: 'all', fields: [], resetFields: [] }, assignToSubmitterManager: false }],
    finalActions: [], rejectionActions: [], rejectedFieldAccess: { mode: 'all', fields: [], resetFields: [] },
    approvedFieldAccess: { mode, fields: ['next_step', 'description'], resetFields: [] } }] });
for (const op of ['Equals', 'Equal', 'Eq']) { const b = body('specific'); b.rules[0].criteria.operator = op; b.rules[0].criteria.value.stringValue = 'QA RT ap 1'; const p = await api('POST', '/workflow/approval-processes', b); out.tries.push(op + ' ' + p.s + ' ' + p.t.slice(0, 300)); if (p.s < 300) { out.id = p.j.data.id || (p.j.data.process && p.j.data.process.id); out.op = op; break; } }
if (out.id) { const g = await api('GET', '/workflow/approval-processes/' + out.id); out.stored = JSON.stringify(g.j.data.rules[0].approvedFieldAccess) + ' guard=' + JSON.stringify(g.j.data.entryGuard) + ' active=' + g.j.data.isActive; }
return done(out);
