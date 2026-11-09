// NDC-2203 helpers (prepended by rcx.sh). Every rule is guarded by its own subject prefix "QA WF <id> ".
const T = '88e8ea44-1658-4df3-9930-d0902b91073d', CONTACTS = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', HR = '08fd8684-c5c0-4d4d-86f9-2be70cf61e53';
const ME = '3445ec4a-020e-4f12-b156-dd2de7610164', QA_EMAIL = 'mmohamed@anyware.software';
const CREATED = [];
const track = (k, id, tag) => CREATED.push({ k, id, tag, at: new Date().toISOString() });
const fin = o => done({ ...o, created: CREATED });
const guard = p => ({ kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: p, caseInsensitive: false });
const and = (...ops) => ({ kind: 'Logical', operator: 'And', operands: ops });
const mkRule = async (tag, trigger, actions, extra) => {
  const r = await api('POST', '/workflow/rules', { moduleId: T, name: `QA WF ${tag}`, isActive: true, mode: 'Recurring', trigger, criteria: guard(`QA WF ${tag} `), actions: actions.map((a, i) => ({ order: i, ...a })), ...(extra || {}) });
  const id = r.j?.data?.id; if (id) track('rule', id, tag); return { s: r.s, id, err: r.s >= 300 ? (r.j?.error?.message || r.t).slice(0, 200) + ' ' + JSON.stringify(r.j?.error?.details || '').slice(0, 200) : undefined };
};
const mkTicket = async (tag, vals) => {
  const r = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: `QA WF ${tag} ticket`, status: 'Open', department: CS, email: QA_EMAIL, channel: 'email', ...(vals || {}) }).map(([k, v]) => ({ field: k, value: enc(v) })) });
  const id = r.j?.data?.id; if (id) track('ticket', id, tag); return { s: r.s, id, err: r.s >= 300 ? r.t.slice(0, 250) : undefined };
};
const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.kind === 'object' ? v.properties : v.value;
const getTicket = async id => { const g = (await api('GET', `/modules/${T}/records/${id}`)).j; const d = g?.data?.data || []; const o = {}; for (const x of d) o[x.field] = val(x.value); return o; };
const execs = async id => arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => ({ rule: e.ruleName || e.rule_name || e.ruleId, status: e.status, actions: (e.actions || e.actionResults || []).map(a => (a.type || a.actionType) + ':' + (a.status) + (a.error ? ' ' + String(a.error).slice(0, 80) : '')) }));
const patchTicket = async (id, vals) => (await api('PATCH', `/modules/${T}/records/${id}`, { data: Object.entries(vals).map(([k, v]) => ({ field: k, value: enc(v) })) })).s;
