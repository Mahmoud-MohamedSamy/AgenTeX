// A6 Blueprint helpers on NDC-Staging (prepended by a6/run.sh). Department Customer Support; every blueprint guarded by a subject prefix "QA BP <tag> ".
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', TECH = '19510fdc-91f3-4a7a-8888-153f1318b765';
const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', AG_A = '9d182dfa-05f3-4af7-9685-8615a2fbe537', AG_B = '2a7c1bc4-f6d4-4bd3-805e-0496ece13987';
const GMAIL = 'mahmoud.mmohamedsamy+qaao@gmail.com';
const MADE = '../a6/made.json';
const made = (() => { try { return JSON.parse(fs.readFileSync(MADE, 'utf8')); } catch (e) { return { bps: [], tickets: [], other: [] }; } })();
const keep = () => fs.writeFileSync(MADE, JSON.stringify(made, null, 1));
const L = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.transitions || x.shares || x.states || x.rules)) || [];
const E = r => r.s + (r.s >= 300 ? ' ' + (r.j?.error?.code || '') + ' ' + String(r.j?.error?.message || r.t).slice(0, 160) + (r.j?.error?.details ? ' ' + JSON.stringify(r.j.error.details).slice(0, 200) : '') : '');
const ST = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const TR = (id, a, b, o = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: o.before || {}, during: o.during || {}, after: { actions: o.after || [] }, ...(o.extra || {}) });
const DEF = (tag, states, transitions, x = {}) => ({ name: 'QA BP ' + tag, description: 'QA A6', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' + tag + ' ' }, states, transitions, ...x });
const BASIC = tag => DEF(tag, [ST('Open'), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]);
const mkBp = async (def, active = true) => { const r = await api('POST', `/modules/${TK}/blueprints`, { definition: def, isActive: active }); if (r.j?.data?.id) { made.bps.push(r.j.data.id); keep(); } return { r, id: r.j?.data?.id }; };
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
const mkT = async (tag, suffix = 'ticket', extra = {}) => { const r = await api('POST', `/modules/${TK}/records`, { data: Object.entries({ subject: 'QA BP ' + tag + ' ' + suffix, status: 'Open', department: CS, ...extra }).map(([f, v]) => ({ field: f, value: enc(v) })) }); const id = r.j?.data?.id; if (id) { made.tickets.push(id); keep(); } else log('ticket fail', E(r)); return id; };
const bstate = async id => L((await api('GET', `/modules/${TK}/records/${id}/blueprint-state`)).j?.data?.states)[0] || null;
const waitIn = async (id, s = 20) => { for (let i = 0; i < s / 2; i++) { const x = await bstate(id); if (x) return x; await sleep(2000); } return null; };
const runT = (id, tid, from = 'Open', extra = {}) => api('POST', `/desk/tickets/${id}/blueprint-transitions/${tid}`, { run_id: crypto.randomUUID(), expected_state_id: from, fields: {}, ...extra });
const trans = async id => L((await api('GET', `/modules/${TK}/records/${id}/blueprint-transitions`)).j?.data).map(x => x.transitionId || x.id);
const hist = async id => L((await api('GET', `/desk/tickets/${id}/history`)).j?.data).map(h => h.action + (h.field_key ? ':' + h.field_key : '') + (h.new_value ? '=' + String(h.new_value).slice(0, 30) : ''));
const fv = v => !v ? v : v.kind === 'array' ? (v.items || []).map(fv) : v.value;
const flds = async id => Object.fromEntries(((await api('GET', `/modules/${TK}/records/${id}`)).j?.data?.data || []).map(x => [x.field, fv(x.value)]));
const getBp = async id => (await api('GET', `/modules/${TK}/blueprints/${id}`)).j?.data;
const R = {}; const out = (k, v) => { R[k] = v; };
const cleanAll = async () => { const c = []; for (const t of made.tickets) c.push((await api('DELETE', `/modules/${TK}/records/${t}`)).s);
  for (const b of made.bps) { await api('POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await api('DELETE', `/modules/${TK}/blueprints/${b}`)).s); }
  made.tickets = []; made.bps = []; keep(); return c.join(' '); };
