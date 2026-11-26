// Shared helpers for the Desk Blueprint regression (prepended to every check by rr.js).
// Everything is created in department QA BP Reg Dept; every blueprint only catches subjects containing "QA BP R <tag> ".
const T = '88e8ea44-1658-4df3-9930-d0902b91073d';          // Desk tickets module (NDC-Staging)
const CONTACTS = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const MADE_FILE = RUN + '/made.json';
const MADE = JSON.parse(fs.readFileSync(MADE_FILE, 'utf8')); MADE.bps = MADE.bps || []; MADE.tickets = MADE.tickets || []; MADE.temp = MADE.temp || [];
const keep = () => fs.writeFileSync(MADE_FILE, JSON.stringify(MADE, null, 1));
const O = k => (MADE.other.find(x => x.kind === k) || {}).id;
const DEPT = MADE.dept;                                       // QA BP Reg Dept
const TECH = '19510fdc-91f3-4a7a-8888-153f1318b765', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const U = { owner: '97be04b6-0a08-4883-aa51-e1650b11cab7', A: '9d182dfa-05f3-4af7-9685-8615a2fbe537', B: '2a7c1bc4-f6d4-4bd3-805e-0496ece13987', C: '23f0f9d7-2fc0-429b-9334-9933fe5c429b', C1: '876ce871-2b02-4854-89a7-68050391c62b', VO: 'd23fb4e0-248d-41f6-af60-d28885a7007e' };
const LBL = { owner: 'ndc-staging-owner', A: 'Customer Experience Specialists 2', B: 'Customer Experience Specialists 1', C: 'Mahmoud TAVIPortal', C1: 'Test User 1', VO: 'Mahmoud Samy' };
const TEAM = O('team'), CONTACT = O('contact'), TPL = O('template'), CA = O('ca_action'), WEBHOOK = O('webhook');
const A = as(LBL.A), B = as(LBL.B), C = as(LBL.C), C1 = as(LBL.C1), VO = as(LBL.VO);
const JS = x => String(JSON.stringify(x));
const uid = () => Math.random().toString(36).slice(2, 7);
const E = r => !r ? 'no response' : r.s + (r.s >= 300 || r.s === 0 ? ' ' + (r.j?.error?.code || '') + ' ' + String(r.j?.error?.message || r.t).slice(0, 200) + (r.j?.error?.details ? ' ' + JSON.stringify(r.j.error.details).slice(0, 300) : '') : '');
const ok = r => r && r.s >= 200 && r.s < 300;
const code = r => r?.j?.error?.code || '';
const L = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.transitions || x.states || x.statuses || x.teams || x.rules || x.drafts)) || [];

// ---- blueprint builders
const ST = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const TR = (id, from, to, o = {}) => ({ id, name: 'QA ' + id, fromStateId: from, toStateId: to, before: o.before || {}, during: o.during || {}, after: { actions: o.after || [] }, ...(o.extra || {}) });
const crit = tag => ({ op: 'contains', field: 'subject', value: 'QA BP R ' + tag + ' ' });
const DEF = (tag, states, transitions, x = {}) => ({ name: 'QA BP R ' + tag, description: 'QA BP regression', moduleKey: 'desk_tickets', targetField: 'status', departmentId: DEPT, entryCriteria: crit(tag), states, transitions, ...x });
const S3 = () => [ST('Open'), ST('Escalated'), ST('Closed', { isTerminal: true })];
const BASIC = (tag, x = {}) => DEF(tag, S3(), [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')], x);
const mkBp = async (def, active = true, who = api) => {
  const r = await who('POST', `/modules/${T}/blueprints`, { definition: def, isActive: active });
  const id = r.j?.data?.id; if (id) { MADE.bps.push(id); keep(); }
  return { r, id, ok: !!id };
};
const getBp = async (id, who = api) => (await who('GET', `/modules/${T}/blueprints/${id}`)).j?.data;
const putBp = async (id, mut, active, who = api) => {               // mut(def) -> def; sends current revision
  const g = await getBp(id, who); const def = mut ? mut(JSON.parse(JSON.stringify(g.definition))) : g.definition;
  return who('PUT', `/modules/${T}/blueprints/${id}`, { definition: def, isActive: active === undefined ? g.isActive : active, revision: g.revision });
};
const listBps = async (who = api) => L((await who('GET', `/modules/${T}/blueprints?includeInactive=true`)).j?.data);

// ---- tickets
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : typeof v === 'object' ? { kind: 'object', properties: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } : { kind: 'string', value: String(v) };
const mkT = async (tag, suffix = 'ticket', extra = {}, who = api) => {
  const data = { subject: 'QA BP R ' + tag + ' ' + suffix, status: 'Open', department: DEPT, contact_id: CONTACT, ...extra };
  const r = await who('POST', `/modules/${T}/records`, { data: Object.entries(data).filter(([, v]) => v !== undefined).map(([f, v]) => ({ field: f, value: enc(v) })) });
  const id = r.j?.data?.id; if (id) { MADE.tickets.push(id); keep(); } else log('ticket create failed', tag, E(r));
  return id;
};
const fv = v => !v ? v : v.kind === 'array' ? (v.items || []).map(fv) : v.kind === 'object' ? Object.fromEntries(Object.entries(v.properties || {}).map(([k, x]) => [k, fv(x)])) : v.value;
const rec = async (id, who = api) => (await who('GET', `/modules/${T}/records/${id}`)).j?.data;
const flds = async (id, who = api) => Object.fromEntries(((await rec(id, who))?.data || []).map(x => [x.field, fv(x.value)]));
const setF = (id, data, who = api) => who('PATCH', `/modules/${T}/records/${id}`, { data: Object.entries(data).map(([f, v]) => ({ field: f, value: enc(v) })) });
const deskT = async (id, who = api) => (await who('GET', `/desk/tickets/${id}`)).j?.data;
const bstate = async (id, who = api) => L((await who('GET', `/modules/${T}/records/${id}/blueprint-state`)).j?.data?.states)[0] || null;
const waitIn = async (id, s = 30, who = api) => { for (let i = 0; i < s / 3; i++) { const x = await bstate(id, who); if (x) return x; await sleep(3000); } return null; };
const waitState = async (id, state, s = 60, who = api) => { for (let i = 0; i < s / 3; i++) { const x = await bstate(id, who); if (x && (x.activeStates || []).includes(state)) return x; if (!x && state === null) return null; await sleep(3000); } return await bstate(id, who); };
const trans = async (id, who = api) => L((await who('GET', `/modules/${T}/records/${id}/blueprint-transitions`)).j?.data);
const transIds = async (id, who = api) => (await trans(id, who)).map(x => x.transitionId || x.id);
const runT = (id, tid, from = 'Open', extra = {}, who = api) => who('POST', `/desk/tickets/${id}/blueprint-transitions/${tid}`, { run_id: crypto.randomUUID(), expected_state_id: from, fields: {}, ...extra });
const hist = async (id, who = api) => L((await who('GET', `/desk/tickets/${id}/history`)).j?.data);
const histTxt = async id => (await hist(id)).map(h => JSON.stringify(h).replace(/"(id|ticket_id|tenant_id|created_at|actor_id)":"[^"]*",?/g, '')).join(' ## ');
const ANY = () => as('anyware-owner', 'a7a7a7a7-0000-0000-0000-000000000002');
const revoke1 = (id, who = api) => who('POST', `/desk/tickets/${id}/blueprint/revoke`, {});
const dueOf = v => !v ? null : typeof v === 'string' ? v : (v.at || v.due_at || v.dueAt || v.value || null); // due fields are objects {at, provisional,…}
const st = x =>(x?.activeStates || []).join('+') || 'none';
const statusOf = async id => (await flds(id)).status;

// ---- after-action builders (kinds as the designer saves them)
const aSet = (field, value, via) => ({ kind: 'setField', field, value, ...(via ? { via } : {}) });
const aNotify = (title, o = {}) => ({ kind: 'sendNotification', title, body: o.body || 'QA BP R notification body {{subject}}', notifyOwner: !!o.owner, notifyPerformer: !!o.performer, userIds: o.userIds || [], teamIds: o.teamIds || [], orgUnitId: null, recipientMode: 'users' });
const aTask = (subject, mode = 'owner', userId = null) => ({ kind: 'createTask', targetModuleKey: 'desk_tasks', fields: { subject, priority: 'high', status: 'Not Started' }, assigneeMode: mode, assigneeUserId: userId });
const aHook = (path, verb = 'POST') => ({ kind: 'webhook', url: 'https://webhook.site/' + WEBHOOK + '/' + path, verb });
const aEmail = (o = {}) => ({ kind: 'deskEmail', templateId: o.templateId || TPL, contact: o.contact !== false, owner: !!o.owner, userIds: o.userIds || [], teamIds: o.teamIds || [], roleTreeIds: [] });
const aCA = (ref = 'QA-BP-R', id = CA) => ({ kind: 'customAction', customActionId: id, inputs: { ref, note: 'QA BP R {{subject}}' } });
// webhook.site inbox (our own, created in Phase 0)
const hooks = async (since) => { const r = await fetch(`https://webhook.site/token/${WEBHOOK}/requests?sorting=newest&per_page=100`, { headers: { accept: 'application/json' } }); const j = await r.json().catch(() => ({})); return (j.data || []).filter(x => !since || new Date(x.created_at.replace(' ', 'T') + 'Z') >= since).map(x => ({ url: x.url, at: x.created_at, body: String(x.content || '').slice(0, 1500), method: x.method })); };
// in-app notifications of a user
const bells = async (who = api) => [...L((await who('GET', '/notifications?limit=50&modules=desk&apps=desk')).j?.data), ...L((await who('GET', '/notifications?limit=50')).j?.data)];
// file upload (attachment items): create → PUT bytes → confirm
const upload = async (name = 'qa-bp-r.txt', text = 'QA BP R attachment', who = api) => {
  const bytes = Buffer.from(text); const c = await who('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: name, declared_content_type: 'text/plain', declared_size_bytes: bytes.length });
  const d = c.j?.data; if (!d) return { err: E(c) };
  let url = d.upload_url; if (url.startsWith('/')) url = 'https://staging-desk.taviportal.com' + url;
  const p = await fetch(url, { method: 'PUT', headers: { 'content-type': 'text/plain' }, body: bytes });
  const f = await who('POST', `/files/${d.file_id}/confirm`, { file_id: d.file_id, size_bytes: bytes.length });
  return { id: d.file_id, put: p.status, confirm: f.s };
};
const decide = (ticket, approvalId, verdict, who) => who('POST', `/desk/tickets/${ticket}/approvals/${approvalId}/${verdict}`, {});
const modules = async () => L((await api('GET', '/modules')).j?.data);

// ---- department membership (PATCH with the full form body)
const deptGet = async (id = DEPT) => (await api('GET', '/desk/departments/' + id)).j?.data;
const deptMembers = async (add = [], remove = [], viewOnly, id = DEPT) => {
  const d = await deptGet(id);
  const body = { ...d, agent_user_ids: [...new Set([...d.agent_user_ids, ...add])].filter(x => !remove.includes(x)) };
  if (viewOnly) body.view_only_agent_user_ids = viewOnly;
  else body.view_only_agent_user_ids = (d.view_only_agent_user_ids || []).filter(x => body.agent_user_ids.includes(x));
  const r = await api('PATCH', '/desk/departments/' + id, body); await sleep(2500); return r;
};

// ---- RG(bug, verdict, note): record the Known-bug case for a Plane id (cases.json RG group)
const CASES = JSON.parse(fs.readFileSync(require('path').resolve(RUN, '../../docs/desk-blueprint/regression/cases.json'), 'utf8')).cases;
const RG = (bug, verdict, note) => { const c = CASES.find(x => x.group === 'RG' && x.bug === bug); if (c) R(c.id, verdict, bug + ': ' + note); else log('no RG case for', bug); };
const both = (id, bug, pass, note) => { R(id, pass ? 'PASS' : 'FAIL', note); if (bug) RG(bug, pass ? 'PASS' : 'FAIL', note); };

// ---- cleanup of everything this library made (blueprints revoked + deleted + purged, tickets deleted)
const cleanup = async () => {
  const out = { t: 0, b: 0, x: 0, fail: [] };
  for (const x of [...MADE.temp]) { const p = x.kind === 'wfrule' ? `/workflow/rules/${x.id}` : x.kind === 'sla' ? `/desk/sla/policies/${x.id}` : null; if (!p) continue; const r = await api('DELETE', p); if (ok(r) || r.s === 404) { out.x++; MADE.temp = MADE.temp.filter(y => y.id !== x.id); } else out.fail.push(x.kind + ' ' + E(r)); }
  for (const b of [...MADE.bps]) { await api('POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); const r = await api('DELETE', `/modules/${T}/blueprints/${b}`); if (ok(r) || r.s === 404) { out.b++; MADE.bps = MADE.bps.filter(x => x !== b); } else out.fail.push('bp ' + b.slice(0, 8) + ' ' + E(r)); }
  for (const t of [...MADE.tickets]) { const r = await api('DELETE', `/modules/${T}/records/${t}`); if (ok(r) || r.s === 404) { out.t++; MADE.tickets = MADE.tickets.filter(x => x !== t); } else out.fail.push('t ' + t.slice(0, 8) + ' ' + E(r)); }
  keep(); return out;
};
