const out = [];
const tryC = async (label, c) => { const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF probe ' + label, isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: and(guard('QA WF probe '), c), actions: [{ order: 0, type: 'AddTicketComment', commentBody: 'x', commentPublic: false }] });
  const id = r.j?.data?.id; let back = ''; if (id) { back = JSON.stringify((await api('GET', `/workflow/rules/${id}`)).j?.data?.criteria?.operands?.[1] || '').replace(/,"[a-zA-Z]+":null/g, '').slice(0, 220); await api('DELETE', `/workflow/rules/${id}`); }
  out.push(label + ' ' + r.s + ' ' + (r.s >= 300 ? (r.j?.error?.message || '').slice(0, 160) + JSON.stringify(r.j?.error?.details || '').slice(0, 160) : back)); };
const ts = s => ({ kind: 'timestamp', timestampValue: s });
await tryC('not wrap', { kind: 'Not', operand: { kind: 'StringMatch', field: 'description', operator: 'Contains', stringValue: 'QA', caseInsensitive: false } });
await tryC('logical not', { kind: 'Logical', operator: 'Not', operands: [{ kind: 'StringMatch', field: 'description', operator: 'Contains', stringValue: 'QA', caseInsensitive: false }] });
await tryC('between list', { kind: 'Comparison', field: 'due_date', operator: 'Between', negate: false, value: { kind: 'list', listValue: [ts('2026-01-01T00:00:00Z'), ts('2026-02-01T00:00:00Z')] } });
await tryC('notbetween list', { kind: 'Comparison', field: 'due_date', operator: 'Between', negate: true, value: { kind: 'list', listValue: [ts('2026-01-01T00:00:00Z'), ts('2026-02-01T00:00:00Z')] } });
return fin({ out });
