// A4 Group P batch 3: conditions P10 (contact/account), P11 (execution time), P12 (Is Overdue, Created By), P13 (doesn't contain, between, not between, Current Time). Y ticket should fire, N should not.
const ACC = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const mk = async (mid, k, vals) => { const r = await api('POST', `/modules/${mid}/records`, { data: Object.entries(vals).map(([f, v]) => ({ field: f, value: enc(v) })) }); const id = r.j?.data?.id; if (id) track(k, id, 'P10'); return id; };
const cY = await mk(CONTACTS, 'contact', { last_name: 'QA AO WF P10 yes', title: 'QAAOWF-P10 match' });
const cN = await mk(CONTACTS, 'contact', { last_name: 'QA AO WF P10 no', title: 'other' });
const aY = await mk(ACC, 'account', { account_name: 'QA AO WF P10 account', description: 'QAAOWF-P10 match' });
const mark = t => [{ type: 'AddTicketComment', commentBody: `QA AO WF ${t} fired`, commentPublic: false }];
const S = (field, op, v) => ({ kind: 'StringMatch', field, operator: op, stringValue: v, caseInsensitive: false });
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const ts = d => ({ kind: 'timestamp', timestampValue: new Date(Date.now() + d * 864e5).toISOString() });
const conds = {
  P10c: S('contact_id.title', 'Contains', 'QAAOWF-P10'), P10a: S('account_id.description', 'Contains', 'QAAOWF-P10'),
  P11in: C('executionTime', 'Equal', { kind: 'string', stringValue: 'business_hours' }), P11out: C('executionTime', 'Equal', { kind: 'string', stringValue: 'outside_business_hours' }), P11hol: C('executionTime', 'Equal', { kind: 'string', stringValue: 'holiday' }),
  P12od: C('isOverdue', 'Equal', { kind: 'bool', boolValue: true }), P12cb: C('created_by', 'Equal', { kind: 'string', stringValue: OWNER }),
  P13nc: { kind: 'Logical', operator: 'Not', operands: [S('description', 'Contains', 'QAX')] },
  P13bt: and(C('due_date', 'GreaterThanOrEqual', ts(1)), C('due_date', 'LessThanOrEqual', ts(3))),
  P13nb: { kind: 'Logical', operator: 'Not', operands: [and(C('due_date', 'GreaterThanOrEqual', ts(1)), C('due_date', 'LessThanOrEqual', ts(3)))] },
  P13now: C('due_date', 'LessThan', { kind: 'now' })
};
const R = { rules: {}, res: {} };
for (const [t, c] of Object.entries(conds)) { const r = await mkRule(t, { kind: 'RecordCreated' }, mark(t), { criteria: c }); R.rules[t] = r.s + (r.err ? ' ' + r.err : ''); R.res[t] = { id: r.id, t: {} }; }
const due = d => new Date(Date.now() + d * 864e5).toISOString();
const plan = [['P10c', 'Y', { contact_id: cY }], ['P10c', 'N', { contact_id: cN }], ['P10a', 'Y', { account_id: aY }], ['P10a', 'N', {}],
  ['P11in', '?', {}], ['P11out', '?', {}], ['P11hol', '?', {}], ['P12od', 'Y', { due_date: due(-1) }], ['P12od', 'N', { due_date: due(5) }], ['P12cb', 'Y', {}],
  ['P13nc', 'Y', { description: 'plain' }], ['P13nc', 'N', { description: 'has QAX inside' }], ['P13bt', 'Y', { due_date: due(2) }], ['P13bt', 'N', { due_date: due(10) }],
  ['P13nb', 'Y', { due_date: due(10) }], ['P13nb', 'N', { due_date: due(2) }], ['P13now', 'Y', { due_date: due(-1) }], ['P13now', 'N', { due_date: due(5) }]];
for (const [t, e, v] of plan) { const k = await mkTicket(t, v, 'ticket ' + e); R.res[t].t[e] = k.id || k.err; }
await sleep(25000);
const out = {};
for (const [t, x] of Object.entries(R.res)) { out[t] = {}; for (const [e, id] of Object.entries(x.t)) { if (!/^[0-9a-f-]{36}$/.test(id)) { out[t][e] = 'ticket error ' + id; continue; } out[t][e] = (await execs(id)).filter(z => z.rule === x.id).length ? 'fired' : 'not fired'; } }
fs.writeFileSync('../a4/p3.json', JSON.stringify({ R, out }, null, 1));
return { rules: R.rules, out };
