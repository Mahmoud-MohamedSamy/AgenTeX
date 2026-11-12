// C9 / C10 / C11 / C20 / N8 — Add State and statuses (approved by the user 2 Nov 2026).
// Creates "QA BP …" ticket statuses via POST /desk/blueprints/states (what the designer's Add State calls), a big QA blueprint,
// then removes every QA status with PUT /desk/ticket-statuses (current list minus QA ones) and checks the list equals the baseline.
// Usage: TV_CACHE=... UI_STATE=... node states.js
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { chromium } = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright-core');
const { call, sleep, QA_DEPT, TICKETS } = tv; const HOST = 'https://staging-desk.taviportal.com';
const OUT = path.resolve(__dirname, '../evidence/raw'); const B = []; const R = {};
const statuses = async () => (await call('GET', '/desk/ticket-statuses')).json.data.statuses;
const add = async (name, type = 'open') => { const r = await call('POST', '/desk/blueprints/states', { name, type }); return { status: r.status, data: r.json && r.json.data, error: r.json && r.json.error }; };
const isQA = s => /^\s*QA BP/.test(s.value) || /^\s*QA BP/.test(s.label);
let baseline;
(async () => {
  baseline = await statuses(); fs.writeFileSync(path.join(OUT, 'statuses-baseline.json'), JSON.stringify(baseline, null, 2));
  if (baseline.some(isQA)) throw new Error('QA statuses already present - stop');
  // C9
  const c9 = await add('QA BP Verify', 'open'); const after9 = await statuses();
  R.C9 = { create: c9.status, data: c9.data, inList: after9.find(s => s.value === 'QA BP Verify') || null };
  console.log('C9', JSON.stringify(R.C9).slice(0, 300));
  // C10
  R.C10 = {};
  for (const n of ['Open', 'open', ' Open ', 'QA BP Verify']) { const r = await add(n, 'closed'); R.C10[JSON.stringify(n)] = { status: r.status, error: r.error }; }
  console.log('C10', JSON.stringify(R.C10).slice(0, 600));
  // C11
  R.C11 = {};
  for (const n of ['QA BP حالة اختبار', 'QA BP 🚀 state', 'QA BP ' + 'x'.repeat(300), 'QA BP <img src=x onerror=alert(1)>', 'QA BP spaced   ', '']) {
    const r = await add(n, 'on_hold'); R.C11[n.length > 60 ? `long(${n.length})` : JSON.stringify(n)] = { status: r.status, stored: r.data && (r.data.value || r.data.label || r.data.name), storedLen: r.data && String(r.data.value || r.data.name || '').length, error: r.error };
  }
  const bad = await call('POST', '/desk/blueprints/states', { name: 'QA BP badtype', type: 'banana' }); R.C11.badType = { status: bad.status, error: bad.json && bad.json.error };
  console.log('C11', JSON.stringify(R.C11).slice(0, 900));
  // C20 — status used on a blueprint canvas, then removed from Ticket statuses
  const st = (id, x, extra = {}) => ({ id, name: id, position: { x, y: 0 }, slaClock: 'business', ...extra });
  const tr = (id, a, b) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during: {}, after: { actions: [] } });
  const c20 = await tv.blueprint({ name: 'QA BP C20', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP C20 ' }, states: [st('Open', 0), st('QA BP Verify', 400), st('Closed', 800, { isTerminal: true })],
    transitions: [tr('v', 'Open', 'QA BP Verify'), tr('end', 'QA BP Verify', 'Closed')] }, false);
  const c20id = c20.json && c20.json.data && c20.json.data.id; if (c20id) B.push(c20id);
  const cur = await statuses(); const del = await call('PUT', '/desk/ticket-statuses', { statuses: cur.filter(s => s.value !== 'QA BP Verify') });
  R.C20 = { blueprint: c20.status, deleteUsedStatus: { status: del.status, error: del.json && del.json.error }, stillListed: !!(await statuses()).find(s => s.value === 'QA BP Verify') };
  if (!R.C20.stillListed && c20id) { const act = await call('PUT', `/modules/${TICKETS}/blueprints/${c20id}`, { definition: c20.json.data.definition, isActive: true }); R.C20.activateAfterDelete = { status: act.status, error: act.json && act.json.error }; }
  console.log('C20', JSON.stringify(R.C20).slice(0, 700));
  // N8 — 30 states / 80 transitions
  const names = []; for (let i = 1; i <= 26; i++) { const n = 'QA BP N8 S' + String(i).padStart(2, '0'); const r = await add(n, 'open'); if (r.status < 300) names.push(n); }
  const all = ['Open', 'Escalated', 'On Hold', ...names, 'Closed'].slice(0, 30);
  const states = all.map((n, i) => st(n, (i % 6) * 320, n === 'Closed' ? { isTerminal: true } : {})).map((s, i) => ({ ...s, position: { x: (i % 6) * 320, y: Math.floor(i / 6) * 200 } }));
  const trs = []; for (let k = 1; k <= 3 && trs.length < 80; k++) for (let i = 0; i + k < all.length && trs.length < 80; i++) if (all[i] !== 'Closed') trs.push(tr(`t${k}_${i}`, all[i], all[i + k]));
  const t0 = Date.now(); const big = await tv.blueprint({ name: 'QA BP N8 big', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP N8 ' }, states, transitions: trs }, false); const createMs = Date.now() - t0;
  const bigId = big.json && big.json.data && big.json.data.id; if (bigId) B.push(bigId);
  let publishMs = null, pub = null;
  if (bigId) { const t1 = Date.now(); pub = await call('PUT', `/modules/${TICKETS}/blueprints/${bigId}`, { definition: big.json.data.definition, isActive: true }); publishMs = Date.now() - t1; }
  R.N8 = { states: states.length, transitions: trs.length, create: big.status, createMs, createErr: big.status >= 300 ? big.text.slice(0, 400) : undefined, publish: pub && pub.status, publishMs };
  console.log('N8', JSON.stringify(R.N8));
  if (bigId && big.status < 300) {
    const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
    const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
    try {
      const t2 = Date.now(); await pg.goto(`${HOST}/settings/automation/blueprints/${bigId}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await pg.locator('.react-flow__node').nth(29).waitFor({ timeout: 60000 }); R.N8.designerLoadMs = Date.now() - t2;
      R.N8.nodes = await pg.locator('.react-flow__node').count(); R.N8.edges = await pg.locator('.react-flow__edge').count();
      await pg.waitForTimeout(1500); await pg.screenshot({ path: path.join(OUT, 'N8-designer.png') });
      const n = pg.locator('.react-flow__node').filter({ hasText: 'QA BP N8 S10' }).first(); const bx = await n.boundingBox();
      const t3 = Date.now(); if (bx) { await pg.mouse.move(bx.x + 20, bx.y + 15); await pg.mouse.down(); await pg.mouse.move(bx.x + 120, bx.y + 80, { steps: 10 }); await pg.mouse.up(); } R.N8.dragMs = Date.now() - t3;
      await pg.mouse.click(bx.x + 120 + 20, bx.y + 80 + 15).catch(() => { }); await pg.waitForTimeout(800); const t4 = Date.now(); R.N8.panelOpen = /connections/.test(await pg.innerText('body')); R.N8.panelMs = Date.now() - t4;
      const tx = await pg.innerText('body'); R.N8.issues = tx.split('\n').filter(l => /issue|unreachable|no longer/i.test(l)).slice(0, 5);
      await pg.screenshot({ path: path.join(OUT, 'N8-designer-drag.png') });
      await pg.goto('about:blank').catch(() => { }); const lv = pg.getByRole('button', { name: /Leave without saving/ }); if (await lv.count().catch(() => 0)) await lv.click().catch(() => { });
    } catch (e) { R.N8.uiError = e.message.split('\n')[0]; } finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
    console.log('N8 ui', JSON.stringify(R.N8));
  }
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  const log = [];
  log.push(await tv.cleanup([], B));
  try {
    const cur = await statuses(); const keep = cur.filter(s => !isQA(s)); const qa = cur.length - keep.length;
    if (qa) { const p = await call('PUT', '/desk/ticket-statuses', { statuses: keep }); log.push(`remove ${qa} QA statuses ${p.status}${p.status >= 300 ? ' ' + p.text.slice(0, 200) : ''}`); }
    const fin = await statuses(); const same = baseline && JSON.stringify(fin.map(s => [s.value, s.type])) === JSON.stringify(baseline.map(s => [s.value, s.type]));
    log.push('statuses-equal-baseline ' + same); if (!same) log.push('now: ' + fin.map(s => s.value).join(' | ').slice(0, 400));
  } catch (e) { log.push('status cleanup ERR ' + e.message); }
  R.cleanup = log.join(', '); console.log('cleanup', R.cleanup);
  fs.writeFileSync(path.join(OUT, 'states.json'), JSON.stringify(R, null, 2));
});
