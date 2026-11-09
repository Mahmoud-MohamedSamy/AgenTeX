// Batch 4: conditions. Each rule = guard AND condition; action = private comment "<tag> fired". Tickets: one should match (Y), one should not (N).
const ACC = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const mk = async (mid, k, vals) => { const r = await api('POST', `/modules/${mid}/records`, { data: Object.entries(vals).map(([f, v]) => ({ field: f, value: enc(v) })) }); const id = r.j?.data?.id; if (id) track(k, id, 'E1'); return id || r.t.slice(0, 200); };
const cY = await mk(CONTACTS, 'contact', { last_name: 'QA WF E1 yes', title: 'QAWF-E1 match' });
const cN = await mk(CONTACTS, 'contact', { last_name: 'QA WF E1 no', title: 'other' });
const aY = await mk(ACC, 'account', { account_name: 'QA WF E1 account', description: 'QAWF-E1 match' });
const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const S = (field, op, v) => ({ kind: 'StringMatch', field, operator: op, stringValue: v, caseInsensitive: false });
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const ts = d => ({ kind: 'timestamp', timestampValue: new Date(Date.now() + d * 864e5).toISOString() });
const rule = (tag, cond) => api('POST', '/workflow/rules', { moduleId: T, name: `QA WF ${tag}`, isActive: true, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: and(guard(`QA WF ${tag} `), cond), actions: cmt(tag).map((a, i) => ({ order: i, ...a })) }).then(r => { if (r.j?.data?.id) track('rule', r.j.data.id, tag); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 200) : ''); });
const R = { contacts: [cY, cN], account: aY, rules: {} };
R.rules.E1c = await rule('E1c', S('contact_id.title', 'Contains', 'QAWF-E1'));
R.rules.E1a = await rule('E1a', S('account_id.description', 'Contains', 'QAWF-E1'));
R.rules.E2in = await rule('E2in', C('executionTime', 'Equal', { kind: 'string', stringValue: 'business_hours' }));
R.rules.E2out = await rule('E2out', C('executionTime', 'Equal', { kind: 'string', stringValue: 'outside_business_hours' }));
R.rules.E2hol = await rule('E2hol', C('executionTime', 'Equal', { kind: 'string', stringValue: 'holiday' }));
R.rules.E3od = await rule('E3od', C('isOverdue', 'Equal', { kind: 'bool', boolValue: true }));
R.rules.E3cb = await rule('E3cb', C('created_by', 'Equal', { kind: 'string', stringValue: ME }));
R.rules.E4 = await rule('E4', { kind: 'Logical', operator: 'Not', operands: [S('description', 'Contains', 'QAX')] });
R.rules.E5 = await rule('E5', and(C('due_date', 'GreaterThanOrEqual', ts(1)), C('due_date', 'LessThanOrEqual', ts(3))));
R.rules.E5n = await rule('E5n', { kind: 'Logical', operator: 'Not', operands: [and(C('due_date', 'GreaterThanOrEqual', ts(1)), C('due_date', 'LessThanOrEqual', ts(3)))] });
R.rules.E6 = await rule('E6', C('due_date', 'LessThan', { kind: 'now' }));
const due = d => new Date(Date.now() + d * 864e5).toISOString();
const plan = [['E1c', 'Y', { contact_id: cY }], ['E1c', 'N', { contact_id: cN }], ['E1a', 'Y', { account_id: aY }], ['E1a', 'N', {}],
  ['E2in', 'Y', {}], ['E2out', 'N', {}], ['E2hol', 'N', {}], ['E3od', 'Y', { due_date: due(-1) }], ['E3od', 'N', { due_date: due(5) }], ['E3cb', 'Y', {}],
  ['E4', 'Y', { description: 'plain' }], ['E4', 'N', { description: 'has QAX inside' }], ['E5', 'Y', { due_date: due(2) }], ['E5', 'N', { due_date: due(10) }],
  ['E5n', 'Y', { due_date: due(10) }], ['E5n', 'N', { due_date: due(2) }], ['E6', 'Y', { due_date: due(-1) }], ['E6', 'N', { due_date: due(5) }]];
R.tickets = [];
for (const [tag, exp, vals] of plan) { const r = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: `QA WF ${tag} ticket ${exp}`, status: 'Open', department: CS, email: QA_EMAIL, channel: 'email', ...vals }).map(([k, v]) => ({ field: k, value: enc(v) })) }); const id = r.j?.data?.id; if (id) track('ticket', id, tag + exp); R.tickets.push([tag, exp, id || r.t.slice(0, 160)]); }
return fin(R);
