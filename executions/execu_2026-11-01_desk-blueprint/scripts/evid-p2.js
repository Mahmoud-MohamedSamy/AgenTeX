// Fresh reproduction of BP-P2-1..4 for the Plane tickets: API request/response log + screenshots (ONE browser context).
// Writes evidence/raw/P2-*.json and P2-*-ui.png. Everything is "QA BP EV…" in QA WF Dept R and deleted at the end.
// Usage: TV_CACHE=... UI_STATE=... node evid-p2.js
const tv = require('./tv'); const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const { chromium } = require('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/node_modules/playwright-core');
const { call, sleep, TICKETS, QA_DEPT } = tv; const HOST = 'https://staging-desk.taviportal.com';
const RAW = path.resolve(__dirname, '../evidence/raw'); const T = []; const B = []; const W = []; const E = {};
const st = (id, extra = {}) => ({ id, name: id, position: { x: id === 'Open' ? 0 : id === 'Escalated' ? 350 : 700, y: 0 }, slaClock: 'business', ...extra });
const tr = (id, from, to) => ({ id, name: 'QA ' + id, fromStateId: from, toStateId: to, before: {}, during: {}, after: { actions: [] } });
const def = (name, states, transitions) => ({ name: 'QA BP ' + name, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
  entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' + name + ' ' }, states, transitions });
async function mk(d, active) { const r = await tv.blueprint(d, active); const id = r.json && r.json.data && r.json.data.id; if (id) B.push(id); return { r, id }; }
async function fields(t) { const r = await call('GET', `/modules/${TICKETS}/records/${t}`); const m = {}; for (const x of r.json.data.data) m[x.field] = x.value && typeof x.value === 'object' && 'value' in x.value ? x.value.value : x.value; return m; }
const body = r => { try { return JSON.parse(r.text); } catch { return (r.text || '').slice(0, 300); } };
(async () => {
  // BP-P2-1 warning not before the limit (3 cases)
  const g3 = [];
  for (const [k, s] of [['warn 120 = limit 120', { slaMinutes: 120, slaPreExpiryMinutes: 120 }], ['warn 120 > limit 60', { slaMinutes: 60, slaPreExpiryMinutes: 120 }], ['warn 60, no limit', { slaPreExpiryMinutes: 60 }]]) {
    const { r, id } = await mk(def('EV1 ' + k.replace(/\W+/g, '-'), [st('Open', s), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]), false);
    const saved = r.json && r.json.data && r.json.data.definition.states[0];
    g3.push({ case: k, sent: s, status: r.status, saved: saved && { slaMinutes: saved.slaMinutes, slaPreExpiryMinutes: saved.slaPreExpiryMinutes }, id });
  }
  E.P2_1 = g3; console.log('P2-1', JSON.stringify(g3.map(x => [x.case, x.status, x.saved])));
  // BP-P2-2 negative limit
  { const { r, id } = await mk(def('EV2 negative', [st('Open', { slaMinutes: -1 }), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]), false);
    E.P2_2 = { sent: { slaMinutes: -1 }, status: r.status, saved: r.json && r.json.data && r.json.data.definition.states[0].slaMinutes, id }; console.log('P2-2', E.P2_2.status, E.P2_2.saved); }
  // BP-P2-3 auto-move to a transition from another state (+ control: same mistake in customer reply trigger)
  { const states = [st('Open', { autoTransitionId: 'esc2', autoTransitionAfterMinutes: 5 }), st('Escalated'), st('Closed', { isTerminal: true })];
    const trs = [tr('go', 'Open', 'Escalated'), tr('esc2', 'Escalated', 'Closed')];
    const { r, id } = await mk(def('EV3 automove', states, trs), false);
    const s0 = r.json && r.json.data && r.json.data.definition.states[0];
    const ctl = await mk(def('EV3 reply', [st('Open', { onReplyTransitionId: 'esc2' }), st('Escalated'), st('Closed', { isTerminal: true })], trs), false);
    E.P2_3 = { sent: { state: 'Open', autoTransitionId: 'esc2 (Escalated → Closed)', autoTransitionAfterMinutes: 5 }, status: r.status, saved: s0 && { autoTransitionId: s0.autoTransitionId, autoTransitionAfterMinutes: s0.autoTransitionAfterMinutes }, id,
      control: { sent: { state: 'Open', onReplyTransitionId: 'esc2' }, status: ctl.r.status, body: body(ctl.r) } };
    console.log('P2-3', E.P2_3.status, JSON.stringify(E.P2_3.saved), 'control', ctl.r.status); }
  // BP-P2-4 workflow rule sets Status on a ticket in a blueprint
  { const rule = { moduleId: TICKETS, layoutId: '', name: 'QA BP EV4 rule', description: 'QA automation - safe to delete', mode: 'Recurring', isActive: true, trigger: { kind: 'RecordUpdated' },
      criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA BP EV4 ', caseInsensitive: false },
      actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { status: { kind: 'string', stringValue: 'Closed' } } }] };
    const rr = await call('POST', '/workflow/rules', rule); const rid = rr.json && rr.json.data && rr.json.data.id; if (rid) W.push(rid);
    const { id } = await mk(def('EV4', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated'), tr('end', 'Escalated', 'Closed')]), true);
    const t = await tv.ticket('QA BP EV4 ticket'); T.push(t);
    let s; for (let i = 0; i < 15 && !(s = await tv.stateOf(t)); i++) await sleep(1500);
    const f0 = await fields(t);
    const p = await call('PATCH', `/modules/${TICKETS}/records/${t}`, { data: [{ field: 'status', value: tv.v('Closed') }] });
    const run = await call('POST', `/desk/tickets/${t}/blueprint-transitions/go`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null });
    await sleep(12000); const f1 = await fields(t); const s1 = await tv.stateOf(t);
    const rec = await call('GET', `/modules/${TICKETS}/records/${t}`); const num = rec.json && rec.json.data && (rec.json.data.ticket_number || rec.json.data.number || rec.json.data.recordNumber);
    E.P2_4 = { rule: { status: rr.status, trigger: 'RecordUpdated (On Edit)', action: 'Field Update Status = Closed' }, ticket: t, number: num, before: { status: f0.status, blueprintState: s && s.activeStates },
      directPatch: { status: p.status, body: body(p) }, transition: { status: run.status }, after: { status: f1.status, blueprintState: s1 && s1.activeStates || null }, bp: id };
    console.log('P2-4', JSON.stringify(E.P2_4).slice(0, 500)); }
  fs.writeFileSync(path.join(RAW, 'P2-api.json'), JSON.stringify(E, null, 2));
  // Screenshots: designer of P2-1 (warn > limit), P2-2, P2-3 and the P2-4 ticket — one context, session saved back.
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
  pg.on('dialog', d => d.dismiss().catch(() => { }));
  const settle = async (re, s = 45) => { for (let i = 0; i < s; i++) { await pg.waitForTimeout(1000); const t = await pg.innerText('body').catch(() => ''); if (/Sign in to|reason=revoked/.test(t + pg.url())) throw new Error('signed out'); if (re.test(t)) return true; } return false; };
  const shots = [[E.P2_1[1].id, 'P2-1-ui.png', 'Open'], [E.P2_2.id, 'P2-2-ui.png', 'Open'], [E.P2_3.id, 'P2-3-ui.png', 'Open']];
  try {
    for (const [id, file, node] of shots) {
      await pg.goto(`${HOST}/settings/automation/blueprints/${id}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(/Save and Publish/); await pg.waitForTimeout(2000);
      console.log('url', pg.url().replace(/[?#].*/, ''));
      const el = pg.locator('.react-flow__node').filter({ hasText: node }).first(); const bx = await el.boundingBox({ timeout: 8000 }).catch(() => null);
      if (!bx) await pg.screenshot({ path: path.join(RAW, 'debug-' + file) });
      if (bx) { await pg.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await pg.waitForTimeout(1500); }
      await pg.screenshot({ path: path.join(RAW, file) }); console.log('shot', file);
      const lv = pg.getByRole('button', { name: /Leave without saving/ });
      await pg.goto('about:blank').catch(() => { }); if (await lv.count().catch(() => 0)) await lv.click().catch(() => { });
    }
    await pg.goto(`${HOST}/modules/${TICKETS}/records/${E.P2_4.ticket}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(/Closed|Status/); await pg.waitForTimeout(3000);
    await pg.screenshot({ path: path.join(RAW, 'P2-4-ui.png') }); console.log('shot P2-4-ui.png');
    E.P2_4.ticketText = (await pg.innerText('body')).split('\n').filter(l => /Closed|Steps|blueprint|Status|#\d+/i.test(l)).slice(0, 15);
    fs.writeFileSync(path.join(RAW, 'P2-api.json'), JSON.stringify(E, null, 2));
  } finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
})().catch(e => console.error('ERR', e.message)).finally(async () => {
  const log = []; for (const id of W) log.push('rule ' + (await call('DELETE', `/workflow/rules/${id}`)).status);
  log.push(await tv.cleanup(T, B)); console.log('cleanup', log.join(', '));
});
