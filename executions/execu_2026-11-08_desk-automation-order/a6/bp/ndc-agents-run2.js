// Follow-up agent rows on NDC-Staging: B/C ticket access through /desk/tickets, A7 (owner account is not an owner of onlyA),
// D4 (ticket owner changed through Desk assign), F3 notification content, F6 email trace. QA records only, deleted after.
const n = require('./ndc'); const fs = require('fs'); const path = require('path');
const { call, sleep, ID, CS } = n;
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const OUT = path.resolve(__dirname, '../evidence/raw/ndc-agents2.json');
const R = { at: new Date().toISOString(), rows: {} }; const T = [], B = [];
const rec = (row, o) => { R.rows[row] = { ...(R.rows[row] || {}), ...o }; console.log(row, JSON.stringify(o).slice(0, 700)); };
const v = x => ({ kind: 'string', value: String(x) });
const brief = r => ({ status: r.status, code: r.code, msg: r.msg && r.msg.slice(0, 200) });
const tr = (id, from, to, before = {}, after = []) => ({ id, name: 'QA ' + id, fromStateId: from, toStateId: to, before, during: {}, after: { actions: after } });
async function ticket(subject, owner) {
  const data = [['subject', subject], ['department', CS], ['status', 'Open']].concat(owner ? [['owner', owner]] : []).map(([field, val]) => ({ field, value: v(val) }));
  const r = await call('owner', 'POST', `/modules/${TK}/records`, { data }); if (r.status >= 300) throw new Error('ticket ' + r.text.slice(0, 200)); T.push(r.json.data.id); return r.json.data.id;
}
async function waitIn(t) { for (let i = 0; i < 12; i++) { const s = await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`); const x = s.json && s.json.data && (s.json.data.states || [])[0]; if (x) return x; await sleep(2500); } return null; }
async function avail(who, t) { const r = await call(who, 'GET', `/modules/${TK}/records/${t}/blueprint-transitions`); const d = r.json && r.json.data; const l = (d && (d.transitions || d)) || []; return r.status === 200 && Array.isArray(l) ? l.map(x => x.id || x.transition_id || x.transitionId) : r.status + ' ' + r.code; }
const run = (who, t, tid) => call(who, 'POST', `/desk/tickets/${t}/blueprint-transitions/${tid}`, { run_id: require('crypto').randomUUID(), expected_state_id: 'Open', fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null });
(async () => {
  const mark = 'QA BP AG2 ' + Date.now().toString().slice(-6);
  const et = await call('owner', 'GET', '/desk/email-templates'); const tpl = ((et.json && et.json.data && et.json.data.email_templates) || []).find(x => !x.is_system && x.module === 'desk_tickets');
  const def = { name: 'QA BP Agents 2', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
    entryCriteria: { op: 'contains', field: 'subject', value: mark },
    states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 } }, { id: 'Escalated', name: 'Escalated', position: { x: 300, y: 0 } }, { id: 'Closed', name: 'Closed', position: { x: 600, y: 0 }, isTerminal: true }],
    transitions: [tr('onlyA', 'Open', 'Escalated', { allowedUserIds: [ID.A] }), tr('towner', 'Open', 'Escalated', { allowOwner: true }),
      tr('notify', 'Open', 'Escalated', {}, [{ kind: 'sendNotification', title: mark + ' notif', body: 'QA body {{subject}}', notifyOwner: true, teamIds: [] },
        { kind: 'deskEmail', templateId: tpl.id, owner: true, contact: false, teamIds: [], userIds: [ID.B], roleTreeIds: [] }]), tr('end', 'Escalated', 'Closed')] };
  const c = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); const bid = c.json && c.json.data && c.json.data.id; if (bid) B.push(bid); else throw new Error('bp ' + c.text.slice(0, 300));

  const t1 = await ticket(mark + ' t1', ID.A); await waitIn(t1);
  // ticket access of B (Desk Admin, CS) and C (Tech) through the Desk ticket endpoint and the records endpoint
  const acc = {}; for (const w of ['A', 'B', 'C']) acc[w] = { desk: (await call(w, 'GET', `/desk/tickets/${t1}`)).status, records: (await call(w, 'GET', `/modules/${TK}/records/${t1}`)).status, list: (await call(w, 'GET', `/modules/${TK}/records?limit=1`)).status, me: ((await call(w, 'GET', '/iam/me')).json || {}).data ? 'ok' : 'n/a' };
  rec('access', acc);
  // A7: the owner account is not an owner of onlyA
  rec('A7', { ownerSees: await avail('owner', t1), owner_runs_onlyA: brief(await run('owner', t1, 'onlyA')), stillOpen: ((await waitIn(t1)) || {}).state_id || 'n/a' });
  // D4: reassign t1 to B through Desk assign, then who sees towner
  const tries = [{ owner_id: ID.B }, { user_id: ID.B }, { agent_id: ID.B }]; let as;
  for (const b of tries) { as = await call('owner', 'POST', `/desk/tickets/${t1}/assign`, b); if (as.status < 300) { R.assignBody = Object.keys(b)[0]; break; } }
  await sleep(3000);
  const own = await call('owner', 'GET', `/modules/${TK}/records/${t1}`); const ow = ((own.json && own.json.data && own.json.data.data) || []).find(e => e.field === 'owner');
  rec('D4', { B_desk_after_assign: (await call('B', 'GET', `/desk/tickets/${t1}`)).status, B_records_after_assign: (await call('B', 'GET', `/modules/${TK}/records/${t1}`)).status, assign: brief(as), ownerNow: ow && ow.value && ow.value.value, A_sees: await avail('A', t1), B_sees: await avail('B', t1), owner_sees: await avail('owner', t1) });
  // F3/F6: owner runs notify on t2 owned by A; email to owner (A) + user B
  const t2 = await ticket(mark + ' t2', ID.A); await waitIn(t2);
  rec('F3/F6', { run: brief(await run('owner', t2, 'notify')) }); await sleep(12000);
  for (const w of ['A', 'B']) {
    const r = await call(w, 'GET', '/notifications?limit=40'); const l = (r.json && r.json.data && (r.json.data.data || r.json.data)) || [];
    const hit = (Array.isArray(l) ? l : []).filter(x => JSON.stringify(x).includes(mark));
    rec('F3/F6', { ['notif_' + w]: hit.map(x => ({ ev: x.event_type, title: x.title, body: x.body })) });
  }
  const h = await call('owner', 'GET', `/desk/tickets/${t2}/history`); const hist = (h.json && h.json.data) || [];
  rec('F3/F6', { history: hist.map(x => x.action + (x.details ? ' ' + JSON.stringify(x.details).slice(0, 300) : '')).slice(0, 12) });
  for (const p of [`/desk/tickets/${t2}/threads`, `/desk/tickets/${t2}/conversations`, `/desk/tickets/${t2}/emails`, `/desk/email-logs?ticket_id=${t2}`, `/desk/outbound-emails?ticket_id=${t2}`]) {
    const r = await call('owner', 'GET', p); rec('F6 trace', { [p.replace(t2, '{t}')]: r.status + ' ' + r.text.slice(0, 300) });
  }
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  const log = [];
  for (const t of T) { await call('owner', 'POST', `/desk/tickets/${t}/blueprint/revoke`, {}).catch(() => { }); log.push('t' + (await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status); }
  for (const b of B) { await call('owner', 'POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }).catch(() => { }); log.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${b}`)).status); }
  R.cleanup = log.join(' '); R.left = (((await call('owner', 'GET', `/modules/${TK}/blueprints?includeInactive=true`)).json || {}).data || []).length;
  fs.writeFileSync(OUT, JSON.stringify(R, null, 2)); console.log('cleanup', R.cleanup, 'left', R.left);
});
