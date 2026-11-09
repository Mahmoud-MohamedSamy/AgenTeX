const out = {};
for (const [tag, c] of [['p1', { kind: 'Comparison', field: 'threadCount', operator: 'GreaterThanOrEqual', negate: false, value: { kind: 'number', numberValue: 0 } }], ['p2', { kind: 'Comparison', field: 'threadCount', operator: 'GreaterThanOrEqual', negate: false, value: { kind: 'decimal', decimalValue: 0 } }], ['p3', { kind: 'Comparison', field: 'threadCount', operator: 'GreaterThanOrEqual', negate: false, value: { kind: 'int', intValue: 0 } }], ['p4', { kind: 'Comparison', field: 'status', operator: 'Equal', negate: false, value: { kind: 'string', stringValue: 'Open' } }]]) {
  const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF probe ' + tag, isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: c, actions: [{ order: 0, type: 'AddTicketComment', commentBody: 'x', commentPublic: false }] });
  out[tag] = r.s + ' ' + (r.s >= 300 ? JSON.stringify(r.j?.error?.details || r.j?.error?.message).slice(0, 200) : ''); if (r.j?.data?.id) await api('DELETE', '/workflow/rules/' + r.j.data.id);
}
return done(out);
