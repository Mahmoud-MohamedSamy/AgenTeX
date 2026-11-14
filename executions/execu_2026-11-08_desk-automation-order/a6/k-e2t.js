// E2E-2 no-reply half: Ask documents (required reply) -> On Hold with reply trigger + auto-close after 3 min; no reply -> auto-closed.
// Blueprint "QA BP KT", 1 ticket; both deleted at the end.
const n = require('./bp/ndc'); const { call, sleep, CS } = n; const fs = require('fs'); const crypto = require('crypto');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const M = require('./k-made.json'); const G = 'mahmoud.mmohamedsamy+qaao@gmail.com';
const R = {}; const rec = (k, x) => { R[k] = x; console.log(k, JSON.stringify(x).slice(0, 700)); };
const E = r => r.status + (r.status >= 300 ? ' ' + (r.code || '') + ' ' + String(r.msg || '').slice(0, 200) : '');
const v = x => ({ kind: 'string', value: String(x) });
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b, during = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during, after: { actions: [] } });
const val = x => !x ? undefined : x.kind === 'array' ? (x.items || []).map(val) : x.value;
const fld = async t => Object.fromEntries(((await call('owner', 'GET', `/modules/${TK}/records/${t}`)).json?.data?.data || []).map(x => [x.field, val(x.value)]));
const bstate = async t => ((await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`)).json?.data?.states || [])[0] || null;
const hist = async t => ((await call('owner', 'GET', `/desk/tickets/${t}/history`)).json?.data || []).map(h => (h.action || '') + (h.field_key ? ':' + h.field_key : '') + (h.new_value ? '=' + String(h.new_value).slice(0, 40) : '') + (h.summary ? ' ' + JSON.stringify(h.summary).slice(0, 80) : '')).reverse();
let B, T;
(async () => {
  try {
    const def = { name: 'QA BP KT', description: 'QA A6 E2E-2 no-reply half - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
      entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP KT ' },
      states: [st('Open'), st('On Hold', { onReplyTransitionId: 'back', autoTransitionId: 'autoclose', autoTransitionAfterMinutes: 3 }), st('Closed', { isTerminal: true })],
      transitions: [tr('ask', 'Open', 'On Hold', { deskItems: [{ kind: 'reply', mandatory: true }], itemOrder: ['desk:reply'] }), tr('back', 'On Hold', 'Open'), tr('autoclose', 'On Hold', 'Closed')] };
    const b = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); B = b.json?.data?.id; rec('bp', E(b));
    const r = await call('owner', 'POST', `/modules/${TK}/records`, { data: Object.entries({ subject: 'QA BP KT E2E-2 no reply - ignore this mail', status: 'Open', department: CS, contact_id: M.contact, email: G, channel: 'email' }).map(([f, x]) => ({ field: f, value: v(x) })) });
    T = r.json?.data?.id; rec('ticket', E(r));
    for (let i = 0; i < 15 && !(await bstate(T)); i++) await sleep(2000);
    const a = await call('owner', 'POST', `/desk/tickets/${T}/blueprint-transitions/ask`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, reply: { to: [G], cc: [], bcc: [], content: '<p>QA BP KT: no reply needed, this ticket should close itself.</p>', template_id: null, from_address_id: null } });
    const t0 = Date.now(); rec('ask', E(a)); rec('state after ask', (await bstate(T))?.activeStates);
    let closedAt = null; for (let i = 0; i < 60; i++) { await sleep(10000); const s = await bstate(T); const f = await fld(T); if (!s || f.status === 'Closed') { closedAt = Math.round((Date.now() - t0) / 1000); break; } }
    const f = await fld(T); rec('result', { closedAfterSec: closedAt, status: f.status, state: (await bstate(T))?.activeStates || null });
    rec('history', await hist(T));
  } catch (e) { rec('ERROR', String(e.stack || e).slice(0, 400)); }
  finally {
    const c = []; if (T) c.push('t' + (await call('owner', 'DELETE', `/modules/${TK}/records/${T}`)).status);
    if (B) { await call('owner', 'POST', `/desk/blueprints/${B}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${B}`)).status); }
    rec('cleanup', c.join(' ')); fs.writeFileSync(__dirname + '/k-e2t-out.json', JSON.stringify(R, null, 1));
  }
})();
