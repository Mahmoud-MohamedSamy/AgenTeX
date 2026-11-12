// API discovery probe for the Desk Blueprint run. One sign-in. Creates only "QA BP" records in QA WF Dept R and deletes them.
// env P = owner password. Usage: node probe.js
const H = 'https://staging-desk.taviportal.com/api/v1';
const T = 'e8e5e302-3873-4e32-b945-c9cd25c7659d', DEPT = '9a7e391c-be72-49e4-a1cf-763e5c88e23d';
const BASE = { 'content-type': 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000002', 'x-app-key': 'desk' };
let tok;
const call = async (m, p, body) => { const r = await fetch(H + p, { method: m, headers: { ...BASE, authorization: 'Bearer ' + tok, 'idempotency-key': crypto.randomUUID() }, body: body === undefined ? undefined : JSON.stringify(body) });
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 400) }; };
const kv = v => (typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) });
(async () => {
  const lr = await fetch(H + '/iam/auth/login', { method: 'POST', headers: BASE, body: JSON.stringify({ email: 'anyware-staging-owner@anyware.software', password: process.env.P, device_label: 'qa-automation', remember_me: true }) });
  tok = (await lr.json()).data.access_token; console.log('login', lr.status);
  const list = await call('GET', `/modules/${T}/blueprints?includeInactive=true`);
  if(0) console.log(' bp', b.id, '|', b.definition.name, '| active', b.isActive, '| dept', b.department_id, '| inProgress', b.in_progress_count);
  const def = {
    name: 'QA BP probe', description: 'QA automation probe - delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: DEPT,
    entryCriteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA BP ' },
    states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 }, slaClock: 'calendar', slaMinutes: 3, slaPreExpiryMinutes: 1 },
      { id: 'Escalated', name: 'Escalated', position: { x: 300, y: 0 }, slaClock: 'calendar' },
      { id: 'Closed', name: 'Closed', position: { x: 600, y: 0 }, isTerminal: true }],
    transitions: [{ id: 'go', name: 'QA go', fromStateId: 'Open', toStateId: 'Escalated', before: {}, during: { checklist: [{ id: 'c1', label: 'QA check', mandatory: true }], deskItems: [{ kind: 'comment', mandatory: true }] }, after: { actions: [] } },
      { id: 'done', name: 'QA done', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }]
  };
  const c = await call('POST', `/modules/${T}/blueprints`, { definition: def, isActive: true });
  console.log('create', c.s, c.s >= 300 ? c.t : 'id ' + c.j.data.id, '| active', c.j && c.j.data && c.j.data.isActive, '| draft', c.j && c.j.data && c.j.data.hasDraft);
  if (c.s >= 300) return;
  const bp = c.j.data.id;
  try {
    const tk = await call('POST', `/modules/${T}/records`, { data: [{ field: 'subject', value: kv('QA BP probe 001') }, { field: 'department', value: kv(DEPT) }, { field: 'status', value: kv('Open') }] });
    console.log('ticket', tk.s, tk.s >= 300 ? tk.t : tk.j.data.id);
    const tk2 = await call('POST', `/modules/${T}/records`, { data: [{ field: 'subject', value: kv('Probe no prefix QA') }, { field: 'department', value: kv(DEPT) }, { field: 'status', value: kv('Open') }] });
    console.log('ticket2 (no prefix)', tk2.s, tk2.s >= 300 ? tk2.t : tk2.j.data.id);
    if (tk.s < 300) {
      const id = tk.j.data.id; await new Promise(r => setTimeout(r, 4000));
      const st = await call('GET', `/modules/${T}/records/${id}/blueprint-state`);
      const s0 = st.j.data.states[0]; console.log('state', s0 ? `${s0.blueprintName} ${s0.activeStates} esc ${JSON.stringify(s0.escalation_due_at)} warn ${JSON.stringify(s0.warning_due_at)}` : 'NOT IN BLUEPRINT');
      if (tk2.s < 300) { const st2 = await call('GET', `/modules/${T}/records/${tk2.j.data.id}/blueprint-state`); console.log('ticket2 states', st2.j.data.states.length); }
      const bad = await call('POST', `/desk/tickets/${id}/blueprint-transitions/go`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null });
      console.log('run go without items', bad.s, bad.t.slice(0, 250));
      const good = await call('POST', `/desk/tickets/${id}/blueprint-transitions/go`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, checklist: { c1: true }, reply: null, comment: { content: 'QA comment', is_public: false }, attachment_ids: [], resolution: null });
      console.log('run go with items', good.s, good.t.slice(0, 250));
      const ps = await call('PATCH', `/modules/${T}/records/${id}`, { data: [{ field: 'status', value: kv('Closed') }] });
      console.log('PATCH status while in blueprint', ps.s, ps.t.slice(0, 200));
      const hist = await call('GET', `/desk/tickets/${id}/history`); console.log('history actions', (hist.j.data || []).map(h => h.action).slice(0, 8).join(','));
      const rv = await call('POST', `/desk/tickets/${id}/blueprint/revoke`, {}); console.log('revoke', rv.s);
      for (const tid of [id, tk2.s < 300 && tk2.j.data.id].filter(Boolean)) { const d = await call('DELETE', `/modules/${T}/records/${tid}`); console.log('delete ticket', d.s); }
    }
  } finally {
    const d = await call('DELETE', `/modules/${T}/blueprints/${bp}`); console.log('delete blueprint', d.s, d.s >= 300 ? d.t : '');
  }
})().catch(e => console.error('ERR', e.message));
