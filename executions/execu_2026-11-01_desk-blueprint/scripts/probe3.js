// Draft vs live + delete-while-occupied. QA records only, deleted at the end.
const H = 'https://staging-desk.taviportal.com/api/v1', T = 'e8e5e302-3873-4e32-b945-c9cd25c7659d', DEPT = '9a7e391c-be72-49e4-a1cf-763e5c88e23d';
const BASE = { 'content-type': 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000002', 'x-app-key': 'desk' }; let tok;
const call = async (m, p, b) => { const r = await fetch(H + p, { method: m, headers: { ...BASE, authorization: 'Bearer ' + tok }, body: b === undefined ? undefined : JSON.stringify(b) }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t }; };
const kv = v => ({ kind: 'string', value: String(v) });
const def = n => ({ name: n, description: 'QA', moduleKey: 'desk_tickets', targetField: 'status', departmentId: DEPT, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' },
  states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 } }, { id: 'Escalated', name: 'Escalated', position: { x: 300, y: 0 } }, { id: 'Closed', name: 'Closed', position: { x: 600, y: 0 }, isTerminal: true }],
  transitions: [{ id: 'go', name: 'QA go', fromStateId: 'Open', toStateId: 'Escalated', before: {}, during: {}, after: { actions: [] } }, { id: 'end', name: 'QA end', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] });
(async () => {
  tok = (await (await fetch(H + '/iam/auth/login', { method: 'POST', headers: BASE, body: JSON.stringify({ email: 'anyware-staging-owner@anyware.software', password: process.env.P, device_label: 'qa-automation', remember_me: true }) })).json()).data.access_token;
  const c = await call('POST', `/modules/${T}/blueprints`, { definition: def('QA BP P3 v1'), isActive: true }); const id = c.j.data.id;
  console.log('created', c.s, 'hasDraft', c.j.data.hasDraft, 'draftVersion', c.j.data.draftVersion);
  const v0 = await call('GET', `/modules/${T}/blueprints/${id}/versions`); console.log('versions before', v0.j.data.map(v => v.version + (v.isPublished ? 'P' : 'd')).join(','));
  const d2 = def('QA BP P3 v2'); d2.transitions[0].name = 'QA go DRAFT';
  const dr = await call('PUT', `/modules/${T}/blueprints/${id}/draft`, { definition: d2 }); console.log('saveDraft', dr.s, dr.t.slice(0, 200));
  const g = await call('GET', `/modules/${T}/blueprints/${id}`); console.log('GET after draft: name', g.j.data.definition.name, 'hasDraft', g.j.data.hasDraft, 'draftVersion', g.j.data.draftVersion, 'keys', Object.keys(g.j.data).join(','));
  const v1 = await call('GET', `/modules/${T}/blueprints/${id}/versions`); console.log('versions after draft', v1.j.data.map(v => v.version + (v.isPublished ? 'P' : 'd')).join(','));
  const tk = await call('POST', `/modules/${T}/records`, { data: [{ field: 'subject', value: kv('QA BP P3 ticket') }, { field: 'department', value: kv(DEPT) }, { field: 'status', value: kv('Open') }] }); const tid = tk.j.data.id;
  await new Promise(r => setTimeout(r, 4000));
  const tr = await call('GET', `/modules/${T}/records/${tid}/blueprint-transitions`); console.log('ticket sees transition name:', (tr.j.data || []).map(x => x.transitionName).join(','), '(DRAFT name would mean the draft is live)');
  const del = await call('DELETE', `/modules/${T}/blueprints/${id}`); console.log('delete while occupied:', del.s, JSON.stringify(del.t.slice(0, 300)));
  const still = await call('GET', `/modules/${T}/blueprints/${id}`); console.log('blueprint after delete attempt:', still.s);
  const st = await call('GET', `/modules/${T}/records/${tid}/blueprint-state`); console.log('ticket state after delete attempt:', JSON.stringify((st.j.data.states[0] || {}).blueprintName || null));
  await call('POST', `/desk/tickets/${tid}/blueprint/revoke`, {}); console.log('cleanup ticket', (await call('DELETE', `/modules/${T}/records/${tid}`)).s);
  if (still.s === 200) { await call('POST', `/desk/blueprints/${id}/revoke`, { ticket_ids: null, after: null }); console.log('cleanup bp', (await call('DELETE', `/modules/${T}/blueprints/${id}`)).s); }
})().catch(e => console.error('ERR', e.message));
