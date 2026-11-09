// Who moves new tickets out of QA WF Dept R? Creates one QA ticket, reads its history and the automation that touched it, deletes it.
const H = 'https://staging-desk.taviportal.com/api/v1', T = 'e8e5e302-3873-4e32-b945-c9cd25c7659d', DEPT = '9a7e391c-be72-49e4-a1cf-763e5c88e23d';
const BASE = { 'content-type': 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000002', 'x-app-key': 'desk' }; let tok;
const call = async (m, p, b) => { const r = await fetch(H + p, { method: m, headers: { ...BASE, authorization: 'Bearer ' + tok }, body: b === undefined ? undefined : JSON.stringify(b) }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t }; };
const kv = v => ({ kind: 'string', value: String(v) });
(async () => {
  tok = (await (await fetch(H + '/iam/auth/login', { method: 'POST', headers: BASE, body: JSON.stringify({ email: 'anyware-staging-owner@anyware.software', password: process.env.P, device_label: 'qa-automation', remember_me: true }) })).json()).data.access_token;
  const tk = await call('POST', `/modules/${T}/records`, { data: [{ field: 'subject', value: kv('QA BP probe dept 001') }, { field: 'department_id', value: kv(DEPT) }, { field: 'status', value: kv('Open') }] });
  const id = tk.j.data.id; await new Promise(r => setTimeout(r, 5000));
  const h = await call('GET', `/desk/tickets/${id}/history`);
  for (const e of (h.j.data || []).reverse()) console.log(e.occurred_at.slice(11, 19), e.action, e.field_key, JSON.stringify(e.old_value), '->', JSON.stringify(e.new_value), '| source', e.source, '| actor', e.actor && e.actor.kind, e.actor && e.actor.label);
  const ex = await call('GET', `/workflow/executions?recordId=${id}`); console.log('workflow executions', ex.s, (ex.j && ex.j.data || []).map(x => (x.ruleName || x.rule_name || x.ruleId) + ':' + x.outcome).join(' | '));
  const rules = await call('GET', '/workflow/rules?take=200'); console.log('workflow rules', (rules.j.data || []).filter(r => r.isActive).map(r => r.name + ' [' + r.trigger.kind + ']').join(' | '));
  const ar = await call('GET', '/desk/assignment-rules'); console.log('assignment rules', ar.s, ar.t.slice(0, 300));
  console.log('delete', (await call('DELETE', `/modules/${T}/records/${id}`)).s);
})().catch(e => console.error('ERR', e.message));
