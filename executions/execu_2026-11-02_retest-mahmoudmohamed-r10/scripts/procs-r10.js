// Round 9: request bodies for the CRM automation processes, ported from automation/…/crmautomationorder/CrmProcs.java
// (shapes verified on staging-crm 18–28 Oct 2026), plus run-time helpers. Every process is guarded by a name prefix ("QA RT …"),
// so only this round's records match. Everything created is written to ledger.md by the caller.
module.exports = ({ api, T, sleep, arr, ledger }) => {
  const s = v => ({ kind: 'string', stringValue: v });
  const startsWith = (field, v) => ({ kind: 'StringMatch', field, operator: 'StartsWith', stringValue: v, caseInsensitive: false, negate: null });
  const and = (...ops) => ({ kind: 'Logical', operator: 'And', operands: ops });
  const nameField = m => m === T.DEALS ? 'deal_name' : m === T.TASKS ? 'subject' : 'first_name';
  const access = mode => ({ mode, fields: [], resetFields: [] });

  const wf = (moduleId, name, guard, { trigger = 'RecordCreated', fieldName = null, actions = [], mode = 'Recurring', extra = null } = {}) => ({
    moduleId, appKey: 'crm', layoutId: null, departmentIds: [], name, description: null, mode, isActive: false,
    trigger: { kind: trigger, fieldName, fieldNames: null, fieldMatch: null, dateFieldName: null, offsetSeconds: null, offsetMode: null },
    criteria: extra ? and(startsWith(nameField(moduleId), guard), extra) : startsWith(nameField(moduleId), guard),
    actions: actions.map((a, i) => ({ order: i, delaySeconds: 0, ...a })),
  });
  const fieldUpdate = (f, v) => ({ type: 'FieldUpdate', fieldUpdates: { [f]: s(v) } });

  const review = (moduleId, layoutId, name, criteria, channels, fields, reviewerIds, othersIds = reviewerIds) => ({
    moduleId, layoutId, name, description: null, criteria, channels, isActive: false,
    fields: Object.entries(fields).map(([k, t]) => ({ fieldApiName: k, datatypeKey: t, subformFieldPath: null, label: k })),
    rules: [{ name: 'Rule 1', criteria: null, reviewers: [{ kind: 'users', values: reviewerIds }], strategy: 'broadcast', isFallback: false },
      { name: 'Others', criteria: null, reviewers: [{ kind: 'users', values: othersIds }], strategy: 'broadcast', isFallback: true }],
    notifications: { onSubmission: false, onReviewCompletion: false, onRejection: false }, sla: null, retentionDays: 90, notifyOnAutoDelete: false,
    adminUserIds: [], allowAdminEdit: false, webhookUrl: null,
  });

  const level = (approver, submitterManager = false) => ({ approver, waitingFieldAccess: access('none'), afterStageUpdateFields: null, assignTask: null, assignToSubmitterManager: submitterManager });
  const levelUsers = (...ids) => level({ kind: 'users', values: ids });
  const approval = (moduleId, name, onCreate, onEdit, criteria, levels, adminIds, { finalActions = [], rejectionActions = [] } = {}) => ({
    moduleId, name, description: null, executeOnCreate: onCreate, executeOnEdit: onEdit, isActive: false, priority: 10,
    admins: { adminUserIds: adminIds, adminRoleIds: [], allowEdit: false, editScope: 'all_fields', notifyOriginalApproversEmail: false, notifyOriginalApproversInApp: false },
    rules: [{ criteria, levels, finalActions, rejectionActions, rejectedFieldAccess: access('none'), approvedFieldAccess: access('none') }],
  });

  const bpCrit = (field, v) => ({ op: 'startsWith', field, value: v });
  const blueprint = (moduleKey, layoutId, pipelineId, targetField, name, entryCriteria, states, afterActions) => ({
    isActive: false, definition: {
      name, description: '', moduleKey, layoutId, ...(pipelineId ? { pipelineId } : {}), targetField, continuous: false, entryCriteria,
      states: states.map((x, i) => ({ id: x, name: x, position: { x: 80 + 260 * i, y: 80 }, isTerminal: i === states.length - 1 })),
      transitions: states.slice(0, -1).map((x, i) => ({ id: 't_qa_' + i, name: `QA ${x} to ${states[i + 1]}`, fromStateId: x, toStateId: states[i + 1], color: '#2563eb', before: {}, during: {}, after: { actions: i === 0 && afterActions ? afterActions : [] } })),
    },
  });

  // ---- create + ledger ----
  const made = async (who, p, body, label) => {
    const r = await api(who, 'POST', p, body);
    if (r.s < 300 && r.j?.data?.id) ledger(`${label} ${r.j.data.id} "${body.name || body.definition?.name || ''}" (${p})`);
    return r;
  };
  const lead = async (who, name, more = {}, layout = T.LEADS_STD, top = {}) => {
    const r = await api(who, 'POST', `/modules/${T.LEADS}/records`, { layout_id: layout, data: Object.entries({ first_name: name, last_name: name, phone: '0100' + String(Date.now()).slice(-7), ...more }).map(([k, v]) => ({ field: k, value: v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : { kind: 'string', value: String(v) } })), ...top });
    if (r.s < 300 && r.j?.data?.id) ledger(`lead ${r.j.data.id} "${name}" by ${who}`);
    return r;
  };
  const field = async (who, module, id, key) => { const r = await api(who, 'GET', `/modules/${module}/records/${id}`); const d = r.j?.data?.data; if (!Array.isArray(d)) return undefined; const f = d.find(x => x.field === key); return f && (f.value?.value ?? f.value?.stringValue ?? (f.value?.kind === 'null' ? null : f.value)); };
  const waitFor = async (sec, fn) => { for (let i = 0; i < sec / 3; i++) { if (await fn()) return true; await sleep(3000); } return false; };
  const executions = async id => arr((await api('o', 'GET', `/workflow/executions?recordId=${id}&take=200`)).j?.data);
  const reviewHistory = async (who, module, id) => (await api(who, 'GET', `/workflow/reviews/records/${module}/${id}/history`)).j?.data;
  const approvalState = async (who, module, id) => api(who, 'GET', `/workflow/approvals/records/${module}/${id}`);
  const bpState = async (who, module, id) => (await api(who, 'GET', `/modules/${module}/records/${id}/blueprint-state`)).j?.data;
  return { s, startsWith, and, wf, fieldUpdate, review, level, levelUsers, approval, bpCrit, blueprint, made, lead, field, waitFor, executions, reviewHistory, approvalState, bpState };
};
