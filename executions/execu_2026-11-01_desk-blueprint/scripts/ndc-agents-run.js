// Agent rows on NDC-Staging (Customer Support): A3–A8, D1–D4, D6, D7, E12, F3, F6, J9. QA records only, all deleted in finally.
// Accounts: owner (all depts), A = Desk Agent (CS, team CES), B = Desk Admin (CS, team CES), C = Desk Supervisor (Tech).
const n = require('./ndc'); const fs = require('fs'); const path = require('path');
const { call, sleep, ID, CS, TECH } = n;
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', TEAM = '1adfefb7-0c25-4484-ae92-782964695054';
const OUT = path.resolve(__dirname, '../evidence/raw/ndc-agents.json');
const R = { at: new Date().toISOString(), rows: {} }; const T = [], B = [];
const rec = (row, o) => { R.rows[row] = { ...(R.rows[row] || {}), ...o }; console.log(row, JSON.stringify(o).slice(0, 400)); };
const v = x => ({ kind: 'string', value: String(x) });
const st = (id, extra) => ({ id, name: id, position: { x: 0, y: 0 }, ...extra });
const tr = (id, from, to, before = {}, during = {}, after = []) => ({ id, name: 'QA ' + id, fromStateId: from, toStateId: to, before, during, after: { actions: after } });
async function bp(name, transitions, active = true, crit) {
  const def = { name, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
    entryCriteria: { op: 'contains', field: 'subject', value: crit }, states: [...new Set(transitions.flatMap(t => [t.fromStateId, t.toStateId]))].map((x, i) => st(x, x === 'Closed' ? { isTerminal: true, position: { x: 300 * i, y: 0 } } : { position: { x: 300 * i, y: 0 } })), transitions };
  const r = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: active });
  const id = r.json && r.json.data && r.json.data.id; if (id) B.push(id); return { r, id, def };
}
async function ticket(subject, owner) {
  const data = [['subject', subject], ['department', CS], ['status', 'Open']].concat(owner ? [['owner', owner]] : []).map(([field, val]) => ({ field, value: v(val) }));
  const r = await call('owner', 'POST', `/modules/${TK}/records`, { data });
  if (r.status >= 300) throw new Error('ticket ' + r.status + ' ' + r.text.slice(0, 300));
  T.push(r.json.data.id); return r.json.data.id;
}
async function waitIn(t) { for (let i = 0; i < 12; i++) { const s = await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`); const x = s.json && s.json.data && (s.json.data.states || [])[0]; if (x) { if (!R.rawState) R.rawState = JSON.stringify(x).slice(0, 800); return x; } await sleep(2500); } return null; }
async function avail(who, t) {
  const r = await call(who, 'GET', `/modules/${TK}/records/${t}/blueprint-transitions`);
  const d = r.json && r.json.data; const list = (d && (d.transitions || d)) || [];
  if (!R.rawAvail && r.status === 200) R.rawAvail = r.text.slice(0, 1500); return { status: r.status, code: r.code, ids: Array.isArray(list) ? list.map(x => (x.id || x.transition_id || x.transitionId || (x.transition && x.transition.id)) + (x.can_run === false || x.canRun === false ? '(no)' : '')) : JSON.stringify(d).slice(0, 300) };
}
const body = (state, extra = {}) => ({ run_id: require('crypto').randomUUID(), expected_state_id: state, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
const run = (who, t, tid, state = 'Open', extra) => call(who, 'POST', `/desk/tickets/${t}/blueprint-transitions/${tid}`, body(state, extra));
const sid = x => x && (x.state_id || x.stateId || x.current_state_id || x.state && (x.state.id || x.state));
const brief = r => ({ status: r.status, code: r.code, msg: r.msg && r.msg.slice(0, 160), details: r.json && r.json.error && r.json.error.details ? JSON.stringify(r.json.error.details).slice(0, 400) : undefined });
async function fieldOf(t, f) { const r = await call('owner', 'GET', `/modules/${TK}/records/${t}`); const d = (r.json && r.json.data && r.json.data.data) || []; const x = d.find(e => e.field === f); return x && x.value && (x.value.value ?? x.value); }

(async () => {
  const mark = 'QA BP AG ' + Date.now().toString().slice(-6);
  // email template for F6
  const et = await call('owner', 'GET', '/desk/email-templates'); const tpls = (et.json && et.json.data && et.json.data.email_templates) || [];
  const tpl = tpls.find(x => !x.is_system && x.module === 'desk_tickets') || tpls.find(x => x.module === 'desk_tickets'); R.template = tpl && { id: tpl.id, name: tpl.name, system: tpl.is_system };
  const deptFull = { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [ID.C], teamIds: [] }] };
  const main = await bp('QA BP Agents main', [
    tr('any', 'Open', 'Escalated'),
    tr('onlyA', 'Open', 'Escalated', { allowedUserIds: [ID.A] }),
    tr('team', 'Open', 'Escalated', { teamIds: [TEAM] }),
    tr('towner', 'Open', 'Escalated', { allowOwner: true }),
    tr('tech', 'Open', 'Escalated', deptFull),
    tr('notify', 'Open', 'On Hold', {}, {}, [
      { kind: 'sendNotification', title: mark + ' notif {{subject}}', body: 'QA body {{subject}}', notifyOwner: true, teamIds: [] },
      ...(tpl ? [{ kind: 'deskEmail', templateId: tpl.id, owner: true, contact: false, teamIds: [], userIds: [], roleTreeIds: [] }] : [])]),
    tr('end', 'Escalated', 'Closed'), tr('end2', 'On Hold', 'Closed')], true, mark);
  R.mainCreate = brief(main.r); if (!main.id) throw new Error('main blueprint not created ' + main.r.text.slice(0, 300));

  // D1–D4, A5, D6 visibility on one ticket owned by A
  const t1 = await ticket(mark + ' t1 visibility', ID.A); const s1 = await waitIn(t1); rec('setup', { t1InBlueprint: !!s1, state: s1 && (s1.state_id || s1.stateId) });
  rec('B ticket access', { B_GET_t1: brief(await call('B', 'GET', `/modules/${TK}/records/${t1}`)), A_GET_t1: brief(await call('A', 'GET', `/modules/${TK}/records/${t1}`)) });
  const vis = {}; for (const w of ['owner', 'A', 'B', 'C']) vis[w] = await avail(w, t1); rec('D1-D4,D6,A5 visible transitions (t1 owner=A)', vis);
  // A7: B runs onlyA
  rec('A7', { B_runs_onlyA: brief(await run('B', t1, 'onlyA')), stillOpen: sid(await waitIn(t1)) });
  // D2 negative for C too (not owner of onlyA)
  rec('D2', { C_runs_onlyA: brief(await run('C', t1, 'onlyA')) });
  // D4: change ticket owner to B → who sees towner
  const po = await call('owner', 'PATCH', `/modules/${TK}/records/${t1}`, { data: [{ field: 'owner', value: v(ID.B) }] });
  await sleep(2000); rec('D4', { patchOwner: brief(po), ownerNow: await fieldOf(t1, 'owner'), A: await avail('A', t1), B: await avail('B', t1) });
  // D3: owner account (not in team) runs team; A (in team) runs team
  rec('D3', { owner_runs_team_on_t1: 'skipped (would move t1)', note: 'see visibility' });
  const t3 = await ticket(mark + ' t3 team', ID.A); await waitIn(t3);
  rec('D3', { A_runs_team: brief(await run('A', t3, 'team')), stateAfter: sid(await waitIn(t3)) });

  // D6 / J9: C (Tech) runs tech on a CS ticket
  const t4 = await ticket(mark + ' t4 tech', ID.A); await waitIn(t4);
  const cBefore = await call('C', 'GET', `/modules/${TK}/records/${t4}`); let waited = 0; for (; waited < 40; waited += 4) { const g = await call('C', 'GET', `/modules/${TK}/records/${t4}`); if (g.status === 200) break; await sleep(4000); } R.cWaitedSec = waited;
  const shared = await fieldOf(t4, 'shared_departments');
  const cRun = await run('C', t4, 'tech'); await sleep(3000);
  const cAfter = await call('C', 'GET', `/modules/${TK}/records/${t4}`);
  rec('D6/J9', { sharedDepartmentsWhileInOpen: shared, C_GET_ticket_before: cBefore.status, C_runs_tech: brief(cRun), stateAfter: sid(await waitIn(t4)), sharedAfterLeaving: await fieldOf(t4, 'shared_departments'), C_GET_ticket_after: cAfter.status });
  const h4 = await call('owner', 'GET', `/desk/tickets/${t4}/history`); R.history_t4 = ((h4.json && h4.json.data) || []).map(x => x.action || x.event_type || x.type).slice(0, 20);

  // A8: ticket outside any blueprint (subject does not match), C has no share
  const t5 = await ticket('QA BP outside ' + mark.slice(-6));
  rec('A8', { C_GET_ticket: brief(await call('C', 'GET', `/modules/${TK}/records/${t5}`)), C_GET_state_of_t1like: brief(await call('C', 'GET', `/modules/${TK}/records/${t5}/blueprint-state`)), C_runs_on_t5: brief(await run('C', t5, 'any')) });

  // A6: A revokes a ticket from the blueprint
  const t6 = await ticket(mark + ' t6 revoke', ID.A); await waitIn(t6);
  rec('A6', { A_revoke: brief(await call('A', 'POST', `/desk/tickets/${t6}/blueprint/revoke`, {})), stillIn: !!(await waitIn(t6)) });

  // F3/F6: owner runs notify on a ticket owned by A
  const t7 = await ticket(mark + ' t7 notify', ID.A); await waitIn(t7);
  rec('F3/F6', { owner_runs_notify: brief(await run('owner', t7, 'notify')) }); await sleep(10000);
  const na = await call('A', 'GET', '/notifications?limit=30'); const nl = (na.json && na.json.data && (na.json.data.data || na.json.data)) || [];
  const hit = Array.isArray(nl) ? nl.filter(x => String(x.title || '').includes(mark)) : [];
  const h7 = await call('owner', 'GET', `/desk/tickets/${t7}/history`); const hist7 = (h7.json && h7.json.data) || [];
  rec('F3/F6', { A_notifications_status: na.status, A_got_notification: hit.length, distinctIds: new Set(hit.map(x => x.id)).size, events: [...new Set(hit.map(x => x.event_type))], notifTitle: hit[0] && hit[0].title, historyActions: hist7.map(x => x.action || x.event_type || x.type).filter(Boolean).slice(0, 25), emailHistory: JSON.stringify(hist7.filter(x => /mail/i.test(JSON.stringify(x)))).slice(0, 700) });

  // D7: department owner Read only + required reply → save refused?
  const d7 = await bp('QA BP Agents D7', [tr('ro', 'Open', 'Escalated', { departmentOwners: [{ departmentId: TECH, access: 'read_only', userIds: [ID.C], teamIds: [] }] }, { deskItems: [{ kind: 'reply', mandatory: true }] }), tr('end', 'Escalated', 'Closed')], false, mark + ' d7never');
  rec('D7', { readOnly_requiredReply_save: brief(d7.r) });
  const d7r = await bp('QA BP Agents D7r', [tr('rs', 'Open', 'Escalated', { departmentOwners: [{ departmentId: TECH, access: 'restricted', userIds: [ID.C], teamIds: [] }] }, { deskItems: [{ kind: 'reply', mandatory: true }] }), tr('end', 'Escalated', 'Closed')], false, mark + ' d7never');
  rec('D7', { restricted_requiredReply_save: brief(d7r.r) });

  // E12: restricted owner + OPTIONAL reply, C runs it with no reply (active blueprint, own criterion)
  const e12 = await bp('QA BP Agents E12', [tr('rso', 'Open', 'Escalated', { departmentOwners: [{ departmentId: TECH, access: 'restricted', userIds: [ID.C], teamIds: [] }] }, { deskItems: [{ kind: 'reply', mandatory: false }] }), tr('end', 'Escalated', 'Closed')], true, mark + ' e12');
  rec('E12', { create: brief(e12.r) });
  if (e12.id) { const t8 = await ticket(mark + ' e12 t8', ID.A); await waitIn(t8); rec('E12', { C_transitions: await avail('C', t8), C_runs_optional_no_reply: brief(await run('C', t8, 'rso')), C_runs_with_reply: 'not tried', stateAfter: sid(await waitIn(t8)) }); }

  // A3/A4: Agent A (Desk Agent) against blueprint admin API, on a throwaway inactive QA blueprint
  const thr = await bp('QA BP Agents throwaway', [tr('end', 'Open', 'Closed')], false, mark + ' never');
  const id = thr.id; const a = {};
  a.list = brief(await call('A', 'GET', `/modules/${TK}/blueprints?includeInactive=true`));
  a.one = brief(await call('A', 'GET', `/modules/${TK}/blueprints/${id}`));
  a.versions = brief(await call('A', 'GET', `/modules/${TK}/blueprints/${id}/versions`));
  a.create = brief(await call('A', 'POST', `/modules/${TK}/blueprints`, { definition: { ...thr.def, name: 'QA BP Agents by A' }, isActive: false }));
  a.put = brief(await call('A', 'PUT', `/modules/${TK}/blueprints/${id}`, { definition: { ...thr.def, name: 'QA BP Agents renamed by A' }, isActive: false }));
  a.draft = brief(await call('A', 'PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: thr.def }));
  a.publish = brief(await call('A', 'POST', `/modules/${TK}/blueprints/${id}/publish`, {}));
  a.sort = brief(await call('A', 'PATCH', `/modules/${TK}/blueprints/sort`, { department_id: CS, items: [{ id, sort_order: 1024 }] }));
  a.include = brief(await call('A', 'POST', `/desk/blueprints/${id}/include`, { state_id: 'Open', ticket_ids: [t5] }));
  a.revokeAll = brief(await call('A', 'POST', `/desk/blueprints/${id}/revoke`, { ticket_ids: null, after: null }));
  a.del = brief(await call('A', 'DELETE', `/modules/${TK}/blueprints/${id}`));
  const after = await call('owner', 'GET', `/modules/${TK}/blueprints/${id}`); a.ownerSeesAfter = { status: after.status, name: after.json && after.json.data && (after.json.data.name || after.json.data.definition && after.json.data.definition.name) };
  const byA = (await call('owner', 'GET', `/modules/${TK}/blueprints?includeInactive=true`)).json; const madeByA = ((byA && byA.data) || []).filter(x => /by A/.test(x.name || (x.definition && x.definition.name) || '')); madeByA.forEach(x => B.push(x.id));
  a.createdByA = madeByA.length; rec('A3/A4', a);
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  const log = [];
  for (const t of T) { await call('owner', 'POST', `/desk/tickets/${t}/blueprint/revoke`, {}).catch(() => { }); log.push('t' + (await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status); }
  for (const b of [...new Set(B)]) { await call('owner', 'POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }).catch(() => { }); log.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${b}`)).status); }
  const left = await call('owner', 'GET', `/modules/${TK}/blueprints?includeInactive=true`); R.cleanup = log.join(' '); R.blueprintsLeft = ((left.json && left.json.data) || []).length;
  fs.writeFileSync(OUT, JSON.stringify(R, null, 2)); console.log('cleanup', R.cleanup, 'left', R.blueprintsLeft);
});
