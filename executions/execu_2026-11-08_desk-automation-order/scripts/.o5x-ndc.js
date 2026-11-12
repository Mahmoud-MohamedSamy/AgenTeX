// A4 Workflow helpers (prepended by a4/run.sh). Rules: QA AO Dept A only, guarded by subject "QA AO WF <tag> ", deleted by a4/clean.js.
const T = '88e8ea44-1658-4df3-9930-d0902b91073d', CONTACTS = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const D = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', D2 = 'b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';
const SAMY = 'd23fb4e0-248d-41f6-af60-d28885a7007e', A1 = '876ce871-2b02-4854-89a7-68050391c62b', A3 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const QA_EMAIL = 'mahmoud.mmohamedsamy+qaao@gmail.com';
const LEDGER = '../a4/ledger.json';
const arr2 = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records || x.rules || x.teams)) || [];
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : (v && typeof v === 'object') ? { kind: 'object', properties: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } : { kind: 'string', value: String(v) };
const track = (k, id, tag) => { let l = []; try { l = JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch (e) {} l.push({ k, id, tag, at: new Date().toISOString() }); fs.writeFileSync(LEDGER, JSON.stringify(l, null, 1)); };
const guard = p => ({ kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: p, caseInsensitive: false });
const and = (...ops) => ({ kind: 'Logical', operator: 'And', operands: ops });
const pre = tag => `QA AO WF ${tag} `;
const mkRule = async (tag, trigger, actions, extra) => {
  const crit = extra && extra.criteria ? and(guard(pre(tag)), extra.criteria) : guard(pre(tag));
  const x = { ...(extra || {}) }; delete x.criteria;
  const r = await api('POST', '/workflow/rules', { moduleId: T, departmentIds: [D], name: `QA AO WF ${tag}`, isActive: true, mode: 'Recurring', trigger, criteria: crit, actions: actions.map((a, i) => ({ order: i, delaySeconds: 0, ...a })), ...x });
  const id = r.j?.data?.id; if (id) track('rule', id, tag);
  return { s: r.s, id, err: r.s >= 300 ? String(r.j?.error?.message || r.t).slice(0, 220) + ' ' + JSON.stringify(r.j?.error?.details || '').slice(0, 200) : undefined };
};
const mkTicket = async (tag, vals, suffix) => {
  const r = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: `${pre(tag)}${suffix || 'ticket'}`, status: 'Open', department: D, email: QA_EMAIL, channel: 'email', ...(vals || {}) }).map(([k, v]) => ({ field: k, value: enc(v) })) });
  const id = r.j?.data?.id; if (id) track('ticket', id, tag); return { s: r.s, id, err: r.s >= 300 ? r.t.slice(0, 250) : undefined };
};
const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.kind === 'object' ? v.properties : v.value;
const getTicket = async id => { const g = (await api('GET', `/modules/${T}/records/${id}`)).j; const d = g?.data?.data || []; const o = {}; for (const x of d) o[x.field] = val(x.value); return o; };
const execs = async id => arr2((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => ({ rule: e.ruleName || e.rule_name || e.ruleId, outcome: e.outcome || e.status, trig: e.triggerKind || e.trigger, actions: (e.dispatches || e.actions || e.actionResults || []).map(a => (a.actionType || a.type) + ':' + a.status + (a.lastError || a.error ? ' ' + String(a.lastError || a.error).slice(0, 90) : '')) }));
const patchTicket = async (id, vals) => (await api('PATCH', `/modules/${T}/records/${id}`, { data: Object.entries(vals).map(([k, v]) => ({ field: k, value: enc(v) })) })).s;
const waitExec = async (id, n = 1, secs = 60) => { for (let i = 0; i < secs / 3; i++) { const e = await execs(id); if (e.length >= n) return e; await sleep(3000); } return await execs(id); };
const W = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid; const TAG = process.env.O5TAG;
const rule = await mkRule('O5x', { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: 'https://webhook.site/' + W + '/qa-ao-wf-o5x-' + TAG, bodyTemplate: '{"subject":"${subject}","description":"${description}","department":"${department}","email":"${email}"}', headers: {}, timeoutSeconds: 10 }]);
const t = await mkTicket('O5x', { description: TAG + '-only' }, TAG + ' tenant');
fs.writeFileSync('../a4/o5x-' + TAG + '.json', JSON.stringify({ rule: rule.id, rs: rule.s, err: rule.err, t: t.id, ts: t.s, terr: t.err }));
log(TAG, rule.s, rule.err || '', t.s, t.err || '');
