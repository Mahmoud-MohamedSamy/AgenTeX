const RUN = 'x';
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', DA = 'b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6', CON = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const L = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.transitions || x.shares || x.states || x.rules || x.events)) || [];
const E = r => r.s + (r.s >= 300 ? ' ' + (r.j?.error?.code || '') + ' ' + String(r.j?.error?.message || r.t).slice(0, 200) + (r.j?.error?.details ? ' ' + JSON.stringify(r.j.error.details).slice(0, 300) : '') : '');
const ST = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const TR = (id, a, b, o = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: o.before || {}, during: o.during || {}, after: { actions: o.after || [] }, ...(o.extra || {}) });
const DEF = (tag, states, transitions, x = {}) => ({ name: 'QA RT21 BP ' + tag, description: 'QA RT21 BP retest - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA RT21 BP ' + tag + ' ' }, states, transitions, ...x });
const sv = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(sv) } : { kind: 'string', value: String(v) };
const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const bstate = async id => L((await api('GET', `/modules/${TK}/records/${id}/blueprint-state`)).j?.data?.states)[0] || null;
const waitIn = async (id, s = 20) => { for (let i = 0; i < s / 2; i++) { const x = await bstate(id); if (x) return x; await sleep(2000); } return null; };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/bpmid.json';
const o = { tickets: {} }; const P = 'QA RT22 BPMID ';
const def = { name: 'QA RT22 BPMID entry test', description: 'QA - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: P },
  states: [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 350, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 700, y: 0 } })],
  transitions: [TR('escalate', 'Open', 'Escalated'), TR('close', 'Escalated', 'Closed')] };
const b = await api('POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); o.bp = b.j?.data?.id; o.bpRes = E(b); fs.writeFileSync(OUT, JSON.stringify(o, null, 1));
if (!o.bp) return o;
const mk = async (subject, status) => { const r = await api('POST', `/modules/${TK}/records`, { data: fields({ subject, description: 'QA RT22 BPMID', status, department: CS }) }); return r.j?.data?.id || ('ERR ' + E(r)); };
o.tickets.T1 = await mk(P + 'T1 created Open', 'Open');
o.tickets.T2 = await mk(P + 'T2 created Escalated', 'Escalated');
o.tickets.T3 = await mk('QA RT22 BPMIX T3 created Escalated no match', 'Escalated');
fs.writeFileSync(OUT, JSON.stringify(o, null, 1));
await sleep(20000);
o.after_create = {}; for (const [k, id] of Object.entries(o.tickets)) { const s = await bstate(id); const x = await rec(id); o.after_create[k] = { n: x.ticket_number, status: x.status, bp: s ? (s.stateId || s.state_id || s.currentStateId || JSON.stringify(s).slice(0, 120)) : 'not in blueprint' }; }
fs.writeFileSync(OUT, JSON.stringify(o, null, 1)); return o;
