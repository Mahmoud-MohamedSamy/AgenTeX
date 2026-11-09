const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const out = {};
const f = arr((await api('GET', `/modules/${T}/fields`)).j?.data);
out.lookups = f.filter(x => /lookup|user|owner/i.test(x.type || x.dataType || x.data_type || '')).map(x => (x.apiName || x.api_name || x.key || x.name) + ':' + (x.type || x.dataType || x.data_type));
const guard = { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA WF probe ', caseInsensitive: false };
const HR = '08fd8684-c5c0-4d4d-86f9-2be70cf61e53'; out.share = [];
for (const acc of ['read', 'read_only', 'readonly', 'view', 'edit', 'read_write', 'full', 'ReadOnly', 'ReadWrite']) { const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF probe share', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard, actions: [{ type: 'ShareTicket', order: 0, shareDepartmentId: HR, shareAccess: acc }] });
  const id = r.j?.data?.id; if (id) await api('DELETE', `/workflow/rules/${id}`); out.share.push(acc + ' ' + r.s + (r.s >= 300 ? ' ' + JSON.stringify(r.j?.error?.details || '').slice(0, 160) : '')); if (id) break; }
return done(out);
