// Round 12 (NDC-Staging Desk) helpers for multi.js: blueprint definitions in the designer's shape (as automation Bp.java),
// QA tickets, blueprint state/run calls. Every created item is written to ../ledger.md. Names/subjects start "QA RT13 ".
const fs = require('fs'); const path = require('path');
module.exports = ({ api, sleep, arr, ledger }) => {
  const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
  const ids = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ids.json'), 'utf8'));
  const QA = 'QA RT14 ';
  const uuid = () => require('crypto').randomUUID();
  const sv = x => (typeof x === 'number' ? { kind: 'number', value: x } : { kind: 'string', value: String(x) });
  const bp = (name, o = {}) => {
    const d = { name: name.startsWith(QA) ? name : QA + name, description: 'QA retest NDC-2754 8 Nov - safe to delete', moduleKey: 'desk_tickets', targetField: 'status',
      departmentId: o.dept || ids.DEPT_A, entryCriteria: o.criteria || { op: 'contains', field: 'subject', value: o.marker || QA }, states: [], transitions: [] };
    let x = 0;
    const B = {
      state(id, extra = {}) { d.states.push({ id, name: id, position: { x, y: 0 }, slaClock: 'business', ...extra }); x += 300; return B; },
      terminal(id) { return B.state(id, { isTerminal: true }); },
      tr(id, from, to, before = {}, during = {}, after = []) { d.transitions.push({ id, name: 'QA ' + id, fromStateId: from, toStateId: to, before, during, after: { actions: after } }); return B; },
      build: () => d,
    };
    return B;
  };
  const created = { bp: [], tk: [], rule: [], sla: [] };
  const createBp = async (def, active = true) => { const r = await api('o', 'POST', `desk:/modules/${TK}/blueprints`, { definition: def, isActive: active }); if (r.s === 201 || r.s === 200) { const id = r.j?.data?.id; created.bp.push(id); ledger(`blueprint "${def.name}" ${id} (active ${active})`); } return r; };
  const delBp = async id => { await api('o', 'POST', `desk:/desk/blueprints/${id}/revoke`, { ticket_ids: null, after: null }); return api('o', 'DELETE', `desk:/modules/${TK}/blueprints/${id}`); };
  const ticket = async (subject, f = {}, who = 'o') => {
    const all = { subject, department: ids.DEPT_A, status: 'Open', ...f };
    const r = await api(who, 'POST', `desk:/modules/${TK}/records`, { data: Object.entries(all).map(([k, v]) => ({ field: k, value: sv(v) })) });
    const id = r.j?.data?.id; if (id) { created.tk.push(id); ledger(`ticket "${subject}" ${id} (#${r.j?.data?.ticket_number ?? r.j?.data?.number ?? '?'})`); } return r;
  };
  const state = async id => (await api('o', 'GET', `desk:/modules/${TK}/records/${id}/blueprint-state`)).j?.data?.states?.[0] || null;
  const waitState = async (id, ms = 30000) => { const end = Date.now() + ms; let s; do { s = await state(id); if (s) return s; await sleep(1500); } while (Date.now() < end); return null; };
  const run = (tid, trId, expected, items = {}) => api('o', 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/${trId}`, { run_id: uuid(), expected_state_id: expected, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...items });
  const fields = async id => { const r = await api('o', 'GET', `desk:/modules/${TK}/records/${id}`); const m = {}; for (const x of arr(r.j?.data?.data || [])) m[x.field] = x.value && typeof x.value === 'object' ? x.value.value : x.value; return m; };
  const err = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || (r.s >= 400 ? r.t.slice(0, 200) : '')}`.trim();
  return { TK, ids, QA, uuid, sv, bp, created, createBp, delBp, ticket, state, waitState, run, fields, err };
};
