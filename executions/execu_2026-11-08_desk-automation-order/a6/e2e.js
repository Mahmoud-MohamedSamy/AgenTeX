// A6 E2E-1, E2E-3, E2E-4, E2E-5, E2E-6 on NDC-Staging, Customer Support. Each blueprint guarded by subject "QA BP E<n> ". QA data deleted at the end.
// Usage: node e2e.js [1 3 4 5 6]
const n = require('./bp/ndc'); const fs = require('fs'); const crypto = require('crypto');
const { call, sleep, ID, CS, TECH } = n;
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const R = {}; const rec = (k, v) => { R[k] = v; console.log(k, String(JSON.stringify(v)).slice(0, 900)); };
const T = [], B = [];
const E = r => r.status + (r.status >= 300 ? ' ' + r.code + ' ' + String(r.msg || '').slice(0, 140) + (r.json?.error?.details ? ' ' + JSON.stringify(r.json.error.details).slice(0, 240) : '') : '');
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b, o = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: o.before || {}, during: o.during || {}, after: { actions: o.after || [] } });
const def = (tag, states, transitions, x = {}) => ({ name: 'QA BP ' + tag, description: 'QA A6 E2E - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' + tag + ' ' }, states, transitions, ...x });
const v = x => ({ kind: 'string', value: String(x) });
const mkBp = async (d, active = true) => { const r = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: d, isActive: active }); if (r.json?.data?.id) B.push(r.json.data.id); return { r, id: r.json?.data?.id }; };
async function ticket(tag, sfx, extra = []) {
  const data = [['subject', 'QA BP ' + tag + ' ' + sfx], ['department', CS], ['status', 'Open'], ...extra].map(([field, val]) => ({ field, value: v(val) }));
  const r = await call('owner', 'POST', `/modules/${TK}/records`, { data }); if (r.status >= 300) throw new Error('ticket ' + E(r)); T.push(r.json.data.id); return r.json.data.id;
}
const bstate = async t => ((await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`)).json?.data?.states || [])[0] || null;
async function waitIn(t) { for (let i = 0; i < 12; i++) { const s = await bstate(t); if (s) return s; await sleep(2000); } return null; }
const run = (who, t, tid, from, extra = {}) => call(who, 'POST', `/desk/tickets/${t}/blueprint-transitions/${tid}`, { run_id: crypto.randomUUID(), expected_state_id: from, fields: {}, ...extra });
const fld = async t => Object.fromEntries(((await call('owner', 'GET', `/modules/${TK}/records/${t}`)).json?.data?.data || []).map(x => [x.field, x.value?.value ?? x.value]));
const hist = async t => ((await call('owner', 'GET', `/desk/tickets/${t}/history`)).json?.data || []).map(h => h.action + (h.field_key ? ':' + h.field_key : '') + (h.new_value ? '=' + String(h.new_value).slice(0, 30) : '')).reverse();
const want = process.argv.slice(2).length ? process.argv.slice(2) : ['1', '3', '4', '5', '6'];

async function e1() {
  const d = def('E1', [st('Open'), st('On Hold'), st('Escalated'), st('Closed', { isTerminal: true })], [
    tr('verify', 'Open', 'On Hold', { during: { checklist: [{ id: 'k1', label: 'QA receipt checked', mandatory: true }], deskItems: [{ kind: 'comment', mandatory: true }], itemOrder: ['checklist', 'desk:comment'] } }),
    tr('approve', 'On Hold', 'Escalated', { before: { allowedUserIds: [ID.A] }, during: { deskItems: [{ kind: 'resolution', mandatory: true }], itemOrder: ['desk:resolution'] }, after: [{ kind: 'setField', field: 'description', value: 'QA E1 refund approved' }] }),
    tr('close', 'Escalated', 'Closed')]);
  const { r } = await mkBp(d); rec('E1 publish', E(r));
  const t = await ticket('E1', 'refund request', [['channel', 'Email'], ['email', 'mahmoud.mmohamedsamy+qaao@gmail.com']]); rec('E1 entered', (await waitIn(t))?.activeStates);
  rec('E1 verify without items', E(await run('owner', t, 'verify', 'Open')));
  rec('E1 verify', E(await run('owner', t, 'verify', 'Open', { checklist: { k1: true }, comment: { content: 'QA receipt checked', body_html: '<p>QA receipt checked</p>' } })));
  rec('E1 B approves', E(await run('B', t, 'approve', 'On Hold', { resolution: { content: 'QA refund ok' } })));
  rec('E1 A approves', E(await run('A', t, 'approve', 'On Hold', { resolution: { content: 'QA refund ok' } })));
  await sleep(3000); const f = await fld(t); rec('E1 after-action + resolution', { description: f.description, status: f.status });
  rec('E1 close', E(await run('owner', t, 'close', 'Escalated'))); await sleep(2000);
  rec('E1 completed', { state: await bstate(t), status: (await fld(t)).status });
  rec('E1 history', await hist(t));
}
async function e3() {
  const d = def('E3', [st('Open', { slaMinutes: 2, slaPreExpiryMinutes: 1, slaPreExpiryEscalation: [{ kind: 'setField', field: 'description', value: 'QA E3 warning' }], slaEscalation: [{ kind: 'sendNotification', title: 'QA E3 escalation', body: 'QA E3 state over limit', notifyOwner: true }], autoTransitionAfterMinutes: 3, autoTransitionId: 'esc' }), st('Escalated'), st('Closed', { isTerminal: true })],
    [tr('esc', 'Open', 'Escalated'), tr('end', 'Escalated', 'Closed')]);
  const { r } = await mkBp(d); rec('E3 publish', E(r)); if (r.status >= 300) return;
  const t = await ticket('E3', 'timer'); const s0 = await waitIn(t); rec('E3 entered', { states: s0?.activeStates, due: s0?.slaDueAt, auto: s0?.autoTransitionAt });
  const t0 = Date.now(); let warnAt = null, notes = 0, moved = null;
  while (Date.now() - t0 < 6 * 60000) {
    await sleep(15000); const f = await fld(t); const s = await bstate(t);
    if (!warnAt && /QA E3 warning/.test(f.description || '')) warnAt = Math.round((Date.now() - t0) / 1000);
    if (!moved && s && (s.activeStates || []).includes('Escalated')) moved = Math.round((Date.now() - t0) / 1000);
    if (moved && warnAt) break;
  }
  const nl = await call('owner', 'GET', '/notifications?limit=30'); const list = (nl.json?.data?.items || nl.json?.data || []); notes = (Array.isArray(list) ? list : []).filter(x => /QA E3 escalation/.test(JSON.stringify(x))).length;
  rec('E3 result', { warnAtSec: warnAt, movedAtSec: moved, escalationNotices: notes, status: (await fld(t)).status, history: await hist(t) });
}
async function e4() {
  const d = def('E4', [st('Open'), st('Escalated', { share: { departmentId: TECH, access: 'full' } }), st('On Hold'), st('Closed', { isTerminal: true })],
    [tr('toTech', 'Open', 'Escalated'), tr('techDone', 'Escalated', 'On Hold', { before: { allowedDepartmentIds: [TECH] } }), tr('end', 'On Hold', 'Closed')]);
  let { r } = await mkBp(d); rec('E4 publish (state share)', E(r));
  if (r.status >= 300) { const d2 = def('E4', [st('Open'), st('Escalated'), st('On Hold'), st('Closed', { isTerminal: true })], [tr('toTech', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'share', mandatory: true, departmentId: TECH, access: 'full' }], itemOrder: ['desk:share'] } }), tr('techDone', 'Escalated', 'On Hold', { before: { allowedUserIds: [ID.C] } }), tr('end', 'On Hold', 'Closed')]); ({ r } = await mkBp(d2)); rec('E4 publish (share item + C owner)', E(r)); }
  const t = await ticket('E4', 'cross dept'); await waitIn(t);
  rec('E4 C reads before', (await call('C', 'GET', `/modules/${TK}/records/${t}`)).status);
  rec('E4 toTech', E(await run('owner', t, 'toTech', 'Open', { shares: [{ department_id: TECH, access: 'full' }] })));
  rec('E4 shares', ((await call('owner', 'GET', `/desk/tickets/${t}/shares`)).json?.data || []).map(s => s.department_name + ':' + s.access));
  rec('E4 C reads while shared', (await call('C', 'GET', `/modules/${TK}/records/${t}`)).status);
  rec('E4 C runs techDone', E(await run('C', t, 'techDone', 'Escalated')));
  await sleep(2000);
  rec('E4 shares after', ((await call('owner', 'GET', `/desk/tickets/${t}/shares`)).json?.data || []).map(s => s.department_name + ':' + s.access));
  rec('E4 C reads after', (await call('C', 'GET', `/modules/${TK}/records/${t}`)).status);
}
async function e5() {
  const bad = def('E5', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated')]);
  const c = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: bad, isActive: true }); rec('E5 broken publish', E(c)); if (c.json?.data?.id) B.push(c.json.data.id);
  const good = def('E5', [st('Open'), st('Escalated'), st('On Hold'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated'), tr('hold', 'Escalated', 'On Hold'), tr('end', 'On Hold', 'Closed'), tr('end2', 'Escalated', 'Closed')]);
  const { r, id } = await mkBp(good); rec('E5 fixed publish', E(r));
  const t = await ticket('E5', 'recovery'); await waitIn(t); rec('E5 go', E(await run('owner', t, 'go', 'Open'))); rec('E5 hold', E(await run('owner', t, 'hold', 'Escalated')));
  const noHold = def('E5', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated'), tr('end2', 'Escalated', 'Closed')]);
  rec('E5 draft without On Hold', E(await call('owner', 'PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: noHold })));
  rec('E5 publish removing occupied state', E(await call('owner', 'POST', `/modules/${TK}/blueprints/${id}/publish`, {})));
  rec('E5 revoke', E(await call('owner', 'POST', `/desk/blueprints/${id}/revoke`, { ticket_ids: [t], after: null })));
  rec('E5 ticket after revoke', { state: await bstate(t), status: (await fld(t)).status });
  rec('E5 draft without On Hold after revoke', E(await call('owner', 'PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: noHold })));
  rec('E5 publish after revoke', E(await call('owner', 'POST', `/modules/${TK}/blueprints/${id}/publish`, {})));
  rec('E5 published states', ((await call('owner', 'GET', `/modules/${TK}/blueprints/${id}`)).json?.data?.definition?.states || []).map(s => s.id));
  const vs = (await call('owner', 'GET', `/modules/${TK}/blueprints/${id}/versions`)).json?.data; const list = Array.isArray(vs) ? vs : (vs?.items || []);
  rec('E5 versions', list.map(x => x.version + ':' + Object.keys(x).join('|')).slice(0, 4));
  const v1 = list.find(x => x.version === 1); if (v1) { const rs = await call('owner', 'POST', `/modules/${TK}/blueprints/${id}/versions/${v1.version}/restore`, {}); rec('E5 restore v1', E(rs) + ' ' + JSON.stringify(rs.json?.data || '').slice(0, 200)); rec('E5 publish restored', E(await call('owner', 'POST', `/modules/${TK}/blueprints/${id}/publish`, {}))); }
  const t2 = await ticket('E5', 'after restore'); rec('E5 new ticket after restore', (await waitIn(t2))?.activeStates);
  const b = (await call('owner', 'GET', `/modules/${TK}/blueprints/${id}`)).json?.data; rec('E5 final', { states: (b?.definition?.states || []).map(s => s.id), hasDraft: b?.hasDraft, active: b?.isActive });
}
async function e6() {
  const d = def('E6', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated'), tr('end', 'Escalated', 'Closed')]);
  const { r, id } = await mkBp(d); rec('E6 publish', E(r));
  const t1 = await ticket('E6', 'old one'); const t2 = await ticket('E6', 'old two'); await waitIn(t1); await waitIn(t2);
  rec('E6 deactivate', E(await call('owner', 'PUT', `/modules/${TK}/blueprints/${id}`, { definition: d, isActive: false })));
  const t3 = await ticket('E6', 'new while inactive'); await sleep(6000); rec('E6 new ticket enters while inactive', !!(await bstate(t3)));
  rec('E6 old ticket continues', E(await run('owner', t1, 'go', 'Open')));
  const d2 = { ...d, states: [st('Open'), st('Escalated'), st('On Hold'), st('Closed', { isTerminal: true })], transitions: [tr('go', 'Open', 'Escalated'), tr('hold', 'Escalated', 'On Hold'), tr('end', 'Escalated', 'Closed'), tr('end3', 'On Hold', 'Closed')] };
  rec('E6 draft v2', E(await call('owner', 'PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: d2 }))); rec('E6 publish v2', E(await call('owner', 'POST', `/modules/${TK}/blueprints/${id}/publish`, {})));
  rec('E6 old ticket sees v2 transitions', ((await call('owner', 'GET', `/modules/${TK}/records/${t1}/blueprint-transitions`)).json?.data || []).map(x => x.transitionId || x.id));
  rec('E6 delete with tickets inside', E(await call('owner', 'DELETE', `/modules/${TK}/blueprints/${id}`)));
  rec('E6 revoke all', E(await call('owner', 'POST', `/desk/blueprints/${id}/revoke`, { ticket_ids: null, after: null })));
  rec('E6 after revoke', { t1: await bstate(t1), t2: await bstate(t2) });
  const del = await call('owner', 'DELETE', `/modules/${TK}/blueprints/${id}`); rec('E6 delete when empty', E(del)); if (del.status < 300) B.splice(B.indexOf(id), 1);
}
(async () => {
  try { for (const w of want) { try { await ({ 1: e1, 3: e3, 4: e4, 5: e5, 6: e6 })[w](); } catch (e) { rec('ERROR E' + w, String(e.stack || e).slice(0, 500)); } } }
  finally {
    const c = []; for (const t of T) c.push((await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status);
    for (const b of B) { await call('owner', 'POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${b}`)).status); }
    rec('cleanup', c.join(' ')); fs.writeFileSync(__dirname + '/e2e-out-' + want.join('') + '.json', JSON.stringify(R, null, 1));
  }
})();
