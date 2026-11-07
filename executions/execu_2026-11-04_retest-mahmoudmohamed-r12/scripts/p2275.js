// NDC-2275 helpers (loaded with: const Z = require('./p2275.js')({api, X, sleep, arr, ledger, log}))
module.exports = ({ api, X, sleep, arr, ledger, log }) => {
  const U = { O: '97be04b6-0a08-4883-aa51-e1650b11cab7', A1: '3445ec4a-020e-4f12-b156-dd2de7610164', A2: 'd23fb4e0-248d-41f6-af60-d28885a7007e', A3: '9d182dfa-05f3-4af7-9685-8615a2fbe537' };
  const N = Object.fromEntries(Object.entries(U).map(([k, v]) => [v, k]));
  const A = X.ids.DEPT_A, B = X.ids.DEPT_B, P = 'QA RT12 2275 ';
  const cond = (field_key, operator, value = null) => ({ field_key, operator, value });
  const rules = async (type, dept) => arr((await api('o', 'GET', `desk:/desk/assignment-rules?type=${type}${dept ? '&department_id=' + dept : ''}`)).j?.data?.rules || []);
  const mkRule = async body => { const r = await api('o', 'POST', 'desk:/desk/assignment-rules', { description: 'QA retest r12 - safe to delete', is_active: true, execute_on: ['create'], ...body, name: P + body.name }); const id = r.j?.data?.id; if (id) ledger(`NDC-2275: ${body.type} rule "${P + body.name}" ${id}`); return r; };
  const owner = async id => { const f = await X.fields(id); return { owner: N[f.owner] || f.owner || null, team: f.team || null, dept: f.department === A ? 'A' : f.department === B ? 'B' : f.department, status: f.status }; };
  const tk = async (sfx, f = {}) => { const r = await X.ticket(P + sfx, f); return r.j?.data?.id; };
  const waitOwner = async (id, ms = 20000) => { const end = Date.now() + ms; let o; do { o = await owner(id); if (o.owner || o.team) return o; await sleep(2000); } while (Date.now() < end); return o; };
  return { U, N, A, B, P, cond, rules, mkRule, owner, tk, waitOwner };
};
// ticket with explicit empty owner (API create otherwise defaults the owner to the creator)
module.exports.tkNull = async ({ api, X, ledger }, subject, extra = []) => {
  const data = [{ field: 'subject', value: { kind: 'string', value: subject } }, { field: 'department', value: { kind: 'string', value: X.ids.DEPT_A } }, { field: 'status', value: { kind: 'string', value: 'Open' } }, { field: 'owner', value: { kind: 'null' } }, ...extra];
  const r = await api('o', 'POST', `desk:/modules/${X.TK}/records`, { data }); const id = r.j?.data?.id; if (id) ledger(`ticket "${subject}" ${id}`); return { r, id };
};
module.exports.openCount = async ({ api, X }, uid) => { const f = JSON.stringify([{ field: 'owner', operator: 'equals', value: uid }]); const r = await api('o', 'GET', `desk:/modules/${X.TK}/records?page=1&per_page=200&filters=${encodeURIComponent(f)}`); const L = (r.j?.data?.records || r.j?.data || []); const m = {}; for (const rec of L) { const d = Object.fromEntries((rec.data || []).map(x => [x.field, x.value?.value])); const k = (d.department === X.ids.DEPT_A ? 'A:' : 'other:') + d.status; m[k] = (m[k] || 0) + 1; } return { s: r.s, total: r.j?.meta?.total_count ?? L.length, m }; };
// create (owner = creator) → unassign → priority update (fires Execute-on-Update rules); returns {id, owner}
module.exports.rrRun = async (Z, { api, X, sleep }, sfx, pri = 'medium', wait = 20000) => { const id = await Z.tk(sfx); await api('o', 'POST', `desk:/desk/tickets/${id}/assign`, { owner_id: null, team_id: null }); await sleep(1500); await api('o', 'PATCH', `desk:/modules/${X.TK}/records/${id}`, { data: [{ field: 'priority', value: { kind: 'string', value: pri } }] }); const w = await Z.waitOwner(id, wait); return { id, owner: w.owner || '-', team: w.team }; };
module.exports.hist = async (Z, { api, arr }, id) => arr((await api('o', 'GET', `desk:/desk/tickets/${id}/history`)).j?.data).map(e => [e.action, e.field_key, Z.N[e.old_value] || e.old_value, Z.N[e.new_value] || e.new_value, e.actor?.kind, e.actor?.label].join(' | '));
module.exports.setPrefs = (api, dept, p) => api('o', 'PUT', `desk:/desk/departments/${dept}/round-robin-preferences`, { assign_to_offline_agents: true, department_threshold_enabled: false, department_threshold: 40, agent_threshold_enabled: false, agent_thresholds: [], assign_backlogs: false, backlog_limit: 10, backlog_order: 'created_time', assign_on_closure: false, incoming_mode: 'immediate', ...p });
module.exports.auto = async (Z, { api, arr }, id) => arr((await api('o', 'GET', `desk:/desk/tickets/${id}/activity?page=1&page_size=100`)).j?.data).filter(e => e.action === 'ticket.auto_assigned').map(e => { const s = e.summary || {}; return `${s.rule_type}:${s.rule_name}:${s.strategy || ''}:${Z.N[s.owner_id] || s.owner_id || ''}:team=${s.team_id || ''}:skip=${(s.skipped_user_ids || []).map(u => Z.N[u] || u).join(',')}:trig=${s.trigger}`; });
