const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const S = (field, op, v) => ({ kind: 'StringMatch', field, operator: op, stringValue: v, caseInsensitive: false });
const cmt = [{ type: 'AddTicketComment', commentBody: 'x', commentPublic: false }]; const out = {};
for (const [tag, c] of Object.entries({ P1: C('threadCount', 'GreaterThanOrEqual', { kind: 'number', numberValue: 0 }), P2: C('threadCount', 'GreaterThanOrEqual', { kind: 'int', intValue: 0 }), P3: S('status', 'Equal', 'Open'), P4: C('status', 'Equal', { kind: 'string', stringValue: 'Open' }) })) {
  const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF probe ' + tag, isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: and(guard('QA WF PROBE '), c), actions: cmt.map((a, i) => ({ order: i, ...a })) });
  out[tag] = r.s + ' ' + (r.s > 299 ? (r.j?.error?.message || '') + ' ' + JSON.stringify(r.j?.error?.details || '').slice(0, 200) : ''); if (r.j?.data?.id) out[tag] += ' deleted ' + (await api('DELETE', '/workflow/rules/' + r.j.data.id)).s; }
return out;
