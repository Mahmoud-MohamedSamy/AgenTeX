// N11 (Chrome: designer renders, a node can be dragged; nothing saved) + E13/N1 (script text in a run comment renders as text).
// One context only; session saved back. Usage: TV_CACHE=... UI_STATE=<chrome state> node ui-chrome.js <outDir>
const tv = require('./tv'); const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const { chromium } = require('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/node_modules/playwright-core');
const HOST = 'https://staging-desk.taviportal.com'; const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const st = (id, x, extra = {}) => ({ id, name: id, position: { x, y: 0 }, slaClock: 'business', ...extra });
(async () => {
  const R = {}; const dialogs = []; const T = []; const B = [];
  const def = { name: 'QA BP UIC chrome', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: tv.QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP UIC ' }, states: [st('Open', 0), st('Escalated', 350), st('Closed', 700, { isTerminal: true })],
    transitions: [{ id: 'go', name: 'QA go', fromStateId: 'Open', toStateId: 'Escalated', before: {}, during: { deskItems: [{ kind: 'comment', mandatory: true }] }, after: { actions: [] } },
      { id: 'end', name: 'QA end', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] };
  const r = await tv.blueprint(def, true); const bp = r.json.data.id; B.push(bp);
  const t = await tv.ticket('QA BP UIC xss'); T.push(t); for (let i = 0; i < 15 && !(await tv.stateOf(t)); i++) await tv.sleep(1500);
  const run = await tv.call('POST', `/desk/tickets/${t}/blueprint-transitions/go`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, checklist: {}, reply: null,
    comment: { content: '<p>QA BP UIC <script>alert(5)</script><img src=x onerror=alert(6)> end</p>', is_public: false }, attachment_ids: [], resolution: null });
  R.apiRun = run.status;
  const b = await chromium.launch({ headless: true, channel: 'chrome' }); R.browser = b.version();
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const p = await ctx.newPage();
  p.on('dialog', d => { if (d.type() === 'beforeunload') { R.beforeunloadPrompt = true; return d.accept().catch(() => { }); } dialogs.push(d.message()); d.dismiss().catch(() => { }); });
  try {
    await p.goto(HOST + '/settings/automation/blueprints/' + bp, { waitUntil: 'domcontentloaded', timeout: 90000 });
    for (let i = 0; i < 45; i++) { await p.waitForTimeout(1000); if (/Save and Publish/.test(await p.innerText('body').catch(() => ''))) break; }
    await p.waitForTimeout(2000);
    R.nodes = await p.locator('.react-flow__node').count(); R.edges = await p.locator('.react-flow__edge').count();
    const el = p.locator('.react-flow__node').filter({ hasText: 'Escalated' }).first(); const bx = await el.boundingBox();
    await p.mouse.move(bx.x + 15, bx.y + bx.height / 2); await p.mouse.down(); await p.mouse.move(bx.x + 115, bx.y + 160, { steps: 15 }); await p.mouse.up(); await p.waitForTimeout(800);
    const bx2 = await el.boundingBox(); R.dragMoved = [Math.round(bx2.x - bx.x), Math.round(bx2.y - bx.y)];
    await p.screenshot({ path: path.join(out, 'uic-designer.png') });
    await p.goto(`${HOST}/modules/${tv.TICKETS}/records/${t}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const lv = p.getByRole('button', { name: /Leave without saving/ }); await p.waitForTimeout(1500); if (await lv.count()) await lv.click().catch(() => { });
    for (let i = 0; i < 45; i++) { await p.waitForTimeout(1000); if (/Steps/.test(await p.innerText('body').catch(() => ''))) break; }
    await p.waitForTimeout(3000); const txt = await p.innerText('body');
    R.conversation = { commentShown: txt.includes('QA BP UIC'), scriptTextVisible: txt.includes('alert(5)'), injectedImgs: await p.locator('img[src="x"]').count(), imgAttrs: await p.locator('img[src="x"]').evaluateAll(es => es.map(e => e.outerHTML)), scriptTags: await p.locator('main script, [class*=conversation] script').count() };
    await p.screenshot({ path: path.join(out, 'uic-conversation.png') });
  } catch (e) { R.error = e.message.split('\n')[0]; }
  finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
  R.dialogs = dialogs; R.cleanup = await tv.cleanup(T, B); console.log(JSON.stringify(R)); process.exit(0);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
