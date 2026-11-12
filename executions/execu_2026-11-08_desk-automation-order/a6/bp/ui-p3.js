// Phase 2 UI probe, part 2: ONE browser context only (a second context refreshing the same session revokes every
// session of the owner), and the refreshed session is saved back at the end.
// Rows: G3 in the state panel, E2/E4/E9/E10 + NDC-2753 run with an attachment, E13/N1 rendering in the conversation,
// N5/N6 Arabic (language switched in the same page, then back to English).
// Usage: TV_CACHE=... UI_STATE=... [CH=chrome] node ui-p3.js <outDir>
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { chromium } = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright-core');
const HOST = 'https://staging-desk.taviportal.com'; const { QA_DEPT, TICKETS } = tv;
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const R = {}; const T = []; const B = []; const dialogs = []; const X = '<img src=x onerror=alert(1)>';
const st = (id, extra = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'business', ...extra });
const tr = (id, name, from, to, during = {}, after = [], extra = {}) => ({ id, name, fromStateId: from, toStateId: to, before: {}, during, after: { actions: after }, ...extra });
const text = pg => pg.innerText('body').catch(() => '');
async function settle(pg, re, s = 45) { for (let i = 0; i < s; i++) { await pg.waitForTimeout(1000); if (re.test(await text(pg))) return true; } return false; }
async function step(k, f) { try { R[k] = await f(); } catch (e) { R[k] = { error: e.message.split('\n')[0] }; } console.log(k, JSON.stringify(R[k]).slice(0, 400)); }
(async () => {
  const def = { name: 'QA BP UI3 ' + X, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP UI3 ' },
    states: [st('Open', { position: { x: 0, y: 0 } }), st('Escalated', { position: { x: 350, y: 0 }, slaMinutes: 120, slaPreExpiryMinutes: 60 }), st('On Hold', { position: { x: 350, y: 220 } }), st('Closed', { position: { x: 700, y: 0 }, isTerminal: true })],
    transitions: [
      tr('go', 'QA go ' + X, 'Open', 'Escalated', { messages: [{ id: 'm1', text: 'QA message ' + X }], checklist: [{ id: 'c1', label: 'QA must check', mandatory: true }],
        deskItems: [{ kind: 'comment', mandatory: true }, { kind: 'attachment', mandatory: true }], requiredFields: [{ name: 'priority', datatype: { key: 'pick_list' }, required: true }],
        itemOrder: ['message:m1', 'checklist', 'desk:comment', 'desk:attachment', 'field:priority'] }, [{ kind: 'setField', field: 'description', value: 'UI3 after' }]),
      tr('hold', 'QA نقل إلى الانتظار', 'Escalated', 'On Hold'), tr('end', 'QA end', 'On Hold', 'Closed')] };
  const r = await tv.blueprint(def, true); if (!(r.json && r.json.data)) throw new Error('create ' + r.status + r.text.slice(0, 200));
  const bp = r.json.data.id; B.push(bp);
  const t1 = await tv.ticket('QA BP UI3 form'); T.push(t1);
  for (let i = 0; i < 15 && !(await tv.stateOf(t1)); i++) await tv.sleep(1500);
  const b = await chromium.launch({ headless: true, channel: process.env.CH || 'msedge' });
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } });
  const pg = await ctx.newPage(); pg.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => { }); });
  try {
    await step('G3_panel', async () => {
      await pg.goto(HOST + '/settings/automation/blueprints/' + bp, { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(pg, /Save and Publish/); await pg.waitForTimeout(2000);
      if (/Sign in|sign in/.test(await text(pg))) throw new Error('signed out');
      const el = pg.locator('.react-flow__node').filter({ hasText: 'Escalated' }).first(); const bx = await el.boundingBox();
      await pg.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await pg.waitForTimeout(1500);
      const warn = pg.locator('input').filter({ hasNot: pg.locator('xpath=self::*[@placeholder]') }).locator('xpath=self::*[@value="1"]').first();
      const inputs = pg.locator('input[type=text], input:not([type])'); let idx = -1; const n = await inputs.count();
      for (let i = 0; i < n; i++) if ((await inputs.nth(i).inputValue()) === '1') { idx = i; break; }
      if (idx < 0) return { warnInput: 'not found' };
      await inputs.nth(idx).fill('2'); await pg.waitForTimeout(800); let t = await text(pg); const equal = t.includes('The warning must come before the time limit.');
      await inputs.nth(idx).fill('3'); await pg.waitForTimeout(800); t = await text(pg); const bigger = t.includes('The warning must come before the time limit.');
      const save = pg.getByRole('button', { name: 'Save state' }); const saveDisabled = await save.isDisabled().catch(() => 'n/a');
      await pg.screenshot({ path: path.join(out, 'ui3-g3.png') });
      await pg.getByRole('button', { name: 'Cancel' }).last().click().catch(() => { });
      return { messageWhenEqual: equal, messageWhenBigger: bigger, saveStateDisabled: saveDisabled };
    });
    await step('E4_NDC2753_run', async () => {
      const lv = pg.getByRole('button', { name: /Leave without saving/ });
      await pg.goto(`${HOST}/modules/${TICKETS}/records/${t1}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      if (await lv.count()) await lv.click().catch(() => { });
      await settle(pg, /Steps/); await pg.waitForTimeout(2500);
      await pg.getByRole('button', { name: /QA go/ }).first().click(); await pg.waitForTimeout(2500);
      const fp = path.join(out, 'qa-attach.txt'); fs.writeFileSync(fp, 'QA BP attachment ' + new Date().toISOString());
      await pg.locator('input[type=file]').first().setInputFiles(fp); await pg.waitForTimeout(4000);
      await pg.getByRole('checkbox', { name: /QA must check/ }).check().catch(async () => { await pg.getByText('QA must check').click(); });
      await pg.locator('[contenteditable=true]').first().click(); await pg.keyboard.type('QA BP UI3 comment ' + '<img src=x onerror=alert(3)>');
      const sel = pg.locator('select').last(); const opts = await sel.locator('option').allTextContents();
      await sel.selectOption({ label: opts.find(o => /high/i.test(o)) || opts[1] });
      await pg.waitForTimeout(1000);
      const run = pg.getByRole('button', { name: /^Run$/ }).last(); const enabled = !(await run.isDisabled());
      await pg.screenshot({ path: path.join(out, 'ui3-form-ready.png') });
      let lines = []; let netErr = [];
      pg.on('response', async resp => { if (/blueprint-transitions/.test(resp.url()) && resp.request().method() === 'POST') netErr.push(resp.status() + ' ' + (await resp.text().catch(() => '')).slice(0, 300)); });
      if (enabled) { await run.click(); await pg.waitForTimeout(7000); const t = await text(pg); lines = t.split('\n').filter(l => /couldn|error|fail|attachment|went wrong|try again/i.test(l)).slice(0, 8); await pg.screenshot({ path: path.join(out, 'ui3-after-run.png') }); }
      const s = await tv.stateOf(t1); const att = await tv.call('GET', `/desk/tickets/${t1}/attachments`);
      return { runEnabled: enabled, runResponse: netErr, pageMessages: lines, stateAfter: s && s.activeStates, ticketAttachments: (att.text || '').slice(0, 300), priorityOptions: opts.slice(0, 6) };
    });
    await step('E13_N1_conversation', async () => {
      await pg.reload({ waitUntil: 'domcontentloaded' }); await settle(pg, /Steps/); await pg.waitForTimeout(3000);
      const t = await text(pg); await pg.screenshot({ path: path.join(out, 'ui3-conversation.png') });
      return { commentShown: t.includes('QA BP UI3 comment'), payloadAsText: t.includes('<img src=x onerror=alert(3)>'), alerts: dialogs.length, injectedImgs: await pg.locator('img[src="x"]').count() };
    });
    await step('N5_N6_arabic', async () => {
      await pg.evaluate(() => localStorage.setItem('anyware_language', 'ar'));
      await pg.goto(HOST + '/settings/automation/blueprints/' + bp, { waitUntil: 'domcontentloaded', timeout: 90000 }); await pg.waitForTimeout(10000);
      const dir = await pg.evaluate(() => [document.documentElement.dir, document.documentElement.lang]); const t = await text(pg); await pg.screenshot({ path: path.join(out, 'ui3-ar-designer.png') });
      const engD = [...new Set(t.match(/\b[A-Z][a-z]{2,}(?: [a-z]{2,})*\b/g) || [])].filter(w => !/^(QA|Open|Escalated|Closed|On|Hold|Anyware|Dept|Desk)$/.test(w)).slice(0, 30);
      await pg.goto(`${HOST}/modules/${TICKETS}/records/${t1}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await pg.waitForTimeout(10000);
      const t2 = await text(pg); await pg.screenshot({ path: path.join(out, 'ui3-ar-ticket.png') });
      const engT = [...new Set(t2.match(/\b[A-Z][a-z]{2,}(?: [a-z]{2,})*\b/g) || [])].filter(w => !/^(QA|Open|Escalated|Closed|On|Hold|Anyware|Dept|Desk|Test|Ticket)$/.test(w)).slice(0, 30);
      const arabicTransition = t2.includes('نقل إلى الانتظار') || t.includes('نقل إلى الانتظار');
      await pg.evaluate(() => localStorage.setItem('anyware_language', 'en'));
      return { htmlDirLang: dir, englishInDesigner: engD, englishOnTicket: engT, arabicTransitionShown: arabicTransition };
    });
  } finally {
    await ctx.storageState({ path: process.env.UI_STATE }); await b.close();
  }
  R.dialogs = dialogs; R.cleanup = await tv.cleanup(T, B);
  fs.writeFileSync(path.join(out, 'ui3-results.json'), JSON.stringify(R, null, 2)); console.log('cleanup', R.cleanup);
  process.exit(0);
})().catch(async e => { console.error('ERR', e.message); console.log('cleanup', await tv.cleanup(T, B)); process.exit(1); });
