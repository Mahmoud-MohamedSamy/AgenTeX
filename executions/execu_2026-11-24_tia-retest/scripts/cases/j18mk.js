const me = (await api('GET', '/iam/me')).j?.data; const uid = me.id || me.user_id;
const base = { moduleId: M.leads, appKey: 'crm', name: 'QA TIA J18 rule', description: 'Temporary Tia test (J-18/O-02/O-08) — delete after', trigger: { kind: 'RecordCreated' }, criteria: { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'QA TIA J18' }, mode: 'Recurring', isActive: true };
const tries = [
  [{ type: 'Task', order: 0, delaySeconds: 0, taskTitle: 'QA TIA J18 follow-up task', taskAssigneeUserId: uid, taskDueOffsetDays: 1 }, { type: 'Alert', order: 1, delaySeconds: 0, alertRecipients: [uid], alertTitle: 'QA TIA J18 alert', alertBody: 'A QA TIA J18 lead was created' }],
  [{ type: 'Task', order: 0, delaySeconds: 0, taskTitle: 'QA TIA J18 follow-up task', taskAssigneeUserId: uid, taskDueOffsetDays: 1 }],
];
const out = { attempts: [] };
for (const actions of tries) { const r = await api('POST', '/workflow/rules', { ...base, actions }); out.attempts.push(r.s + ' ' + (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || '').slice(0, 200)); if (r.s < 300) { out.id = r.j?.data?.id; out.actions = actions.map(a => a.type); break; } }
if (out.id) { ledger(`J-18: CRM workflow rule "QA TIA J18 rule" ${out.id} (active, ${out.actions}) — delete after`); const all = ids(); all.j18rule = out.id; all.ownerId = uid; fs.writeFileSync(RUN + '/out/ids.json', JSON.stringify(all, null, 1)); const g = (await api('GET', `/workflow/rules/${out.id}`)).j?.data; out.active = g?.isActive; }
return out;
