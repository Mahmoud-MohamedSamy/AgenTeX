// Phase 2 (owner only) UI probe on a QA copy: designer screens, transition form, attachment, XSS rendering,
// phone width, Arabic/RTL, keyboard labels, Chrome. Creates one QA blueprint + 2 QA tickets via API, deletes them after.
// Nothing is saved in the designer (Save Draft / Save and Publish are never pressed); "Run" is pressed only on QA tickets.
// Usage: TV_CACHE=... UI_STATE=... node ui-p2.js <outDir>
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { chromium } = require('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/node_modules/playwright-core');
const HOST = 'https://staging-desk.taviportal.com'; const { QA_DEPT, TICKETS } = tv;
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const R = {}; const T = []; const B = []; const dialogs = [];
const X = '<img src=x onerror=alert(1)>';
const st = (id, extra = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'business', ...extra });
const tr = (id, name, from, to, during = {}, after = [], extra = {}) => ({ id, name, fromStateId: from, toStateId: to, before: {}, during, after: { actions: after }, ...extra });
async function settle(pg, re, s = 45) { for (let i = 0; i < s; i++) { await pg.waitForTimeout(1000); if (re.test(await pg.innerText('body').catch(() => ''))) return true; } return false; }
const text = pg => pg.innerText('body').catch(() => '');
const has = (t, s) => t.includes(s);
async function shot(pg, n) { await pg.screenshot({ path: path.join(out, n + '.png') }); }
async function step(k, f) { try { R[k] = await f(); } catch (e) { R[k] = { error: e.message.split('\n')[0] }; } console.log(k, JSON.stringify(R[k]).slice(0, 300)); }

(async () => {
  const pos = (x, y) => ({ x, y });
  const def = { name: 'QA BP UI2 ' + X, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP UI2 ' },
    states: [st('Open', { position: pos(0, 0) }), st('Escalated', { position: pos(350, 0), slaMinutes: 120, slaPreExpiryMinutes: 60 }), st('On Hold', { position: pos(350, 220), slaClock: 'calendar' }), st('Closed', { position: pos(700, 0), isTerminal: true })],
    transitions: [
      tr('go', 'QA go ' + X, 'Open', 'Escalated', {
        messages: [{ id: 'm1', text: 'QA message ' + X }], checklist: [{ id: 'c1', label: 'QA must check', mandatory: true }, { id: 'c2', label: 'QA optional check', mandatory: false }],
        deskItems: [{ kind: 'comment', mandatory: true }, { kind: 'attachment', mandatory: true }], requiredFields: [{ name: 'priority', datatype: { key: 'pick_list' }, required: true }],
        itemOrder: ['message:m1', 'checklist', 'desk:comment', 'desk:attachment', 'field:priority'] }, [{ kind: 'setField', field: 'description', value: 'UI2 after' }]),
      tr('noitems', 'QA no items', 'Escalated', 'On Hold'),
      tr('arabic', 'QA نقل إلى الإغلاق', 'On Hold', 'Closed'),
      tr('cancel', 'QA cancel', 'Open', 'Closed', {}, [], { isCommon: true })] };
  const r = await tv.blueprint(def, true); if (!(r.json && r.json.data)) throw new Error('create ' + r.status + r.text.slice(0, 200));
  const bp = r.json.data.id; B.push(bp); R.created = { bp };
  const t1 = await tv.ticket('QA BP UI2 form'); T.push(t1); const t2 = await tv.ticket('QA BP UI2 arabic'); T.push(t2);
  for (let i = 0; i < 15 && !(await tv.stateOf(t1)); i++) await tv.sleep(1500);
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } });
  ctx.on('page', p => p.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => { }); }));
  const pg = await ctx.newPage(); pg.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => { }); });
  try {
    await step('C1_C7_new', async () => {
      await pg.goto(HOST + '/settings/automation/blueprints/new', { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(pg, /Add State/); await pg.waitForTimeout(2000);
      const t = await text(pg); await shot(pg, 'ui2-new');
      return { emptyCanvasText: has(t, 'Drag a status from the list onto the canvas'), fieldTicketStatus: has(t, 'Ticket status'), fieldLockIcon: await pg.locator('text=Ticket status').locator('..').locator('svg').count() > 0 };
    });
    await pg.goto(HOST + '/settings/automation/blueprints/' + bp, { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(pg, /Save and Publish/); await pg.waitForTimeout(2500);
    await step('N1_designer', async () => { const t = await text(pg); await shot(pg, 'ui2-designer'); return { payloadShownAsText: has(t, X), alerts: dialogs.length, imgInjected: await pg.locator('img[src="x"]').count() }; });
    const node = async n => { const el = pg.locator('.react-flow__node').filter({ hasText: n }).first(); const bx = await el.boundingBox(); await pg.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await pg.waitForTimeout(1500); };
    await step('G1_open_state', async () => { await node('Open'); const t = await text(pg); await shot(pg, 'ui2-state-open');
      const lim = await pg.locator('input[placeholder="No limit"]').first().inputValue().catch(() => 'n/a');
      const m = t.match(/(\d+) of 16 connections/); return { limitValue: lim, noLimitPlaceholder: await pg.locator('input[placeholder="No limit"]').count(), connections: m && m[0], reopenHint: has(t, 'Nothing set, so a customer reply reopens the ticket as it does today') }; });
    await step('G2_G3_escalated', async () => { await pg.keyboard.press('Escape'); await node('Escalated'); const t = await text(pg); await shot(pg, 'ui2-state-escalated');
      const ex = (t.match(/A ticket that enters[^\n]*/) || [''])[0];
      const inputs = await pg.locator('input').evaluateAll(els => els.map(e => [e.placeholder, e.value, e.type]).filter(x => x[1] !== '' || x[0]));
      // G3 in the panel: set warn = limit, read the message, then Cancel (nothing saved)
      let warnMsg = null; const warn = pg.locator('xpath=//*[contains(normalize-space(text()),"Warn before")]/following::input[1]').first();
      if (await warn.count()) { await warn.fill('2'); await pg.waitForTimeout(800); const t2 = await text(pg); warnMsg = has(t2, 'The warning must come before the time limit.') ? 'shown' : 'not shown'; await shot(pg, 'ui2-g3-warn-equal'); }
      const cancel = pg.getByRole('button', { name: 'Cancel' }).last(); if (await cancel.count()) await cancel.click().catch(() => { });
      return { example: ex, inputs, warnEqualLimitMessage: warnMsg }; });
    await step('E1_E10_transition_panels', async () => {
      await pg.keyboard.press('Escape'); await pg.waitForTimeout(500);
      const lbl = pg.locator('.react-flow__edge-label, .react-flow__edgelabel-renderer *').filter({ hasText: 'QA no items' }).first();
      let noItems = null; if (await lbl.count()) { const bx = await lbl.boundingBox(); await pg.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await pg.waitForTimeout(1500); const t = await text(pg); noItems = has(t, 'Nothing to fill in, so the agent runs it in one click.'); await shot(pg, 'ui2-tr-noitems'); }
      await pg.keyboard.press('Escape'); await pg.waitForTimeout(500);
      const lg = pg.locator('.react-flow__edge-label, .react-flow__edgelabel-renderer *').filter({ hasText: 'QA go' }).first(); let order = null, during = null;
      if (await lg.count()) { const bx = await lg.boundingBox(); await pg.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await pg.waitForTimeout(1500);
        for (const tab of ['During', 'DURING']) { const tb = pg.getByRole('tab', { name: tab }).or(pg.getByRole('button', { name: tab })).first(); if (await tb.count()) { await tb.click().catch(() => { }); break; } }
        await pg.waitForTimeout(1000); const t = await text(pg); await shot(pg, 'ui2-tr-go-during');
        const idx = ['QA message', 'QA must check', 'Internal comment', 'Attachment', 'Priority'].map(s => [s, t.indexOf(s)]); order = idx; during = { validationOption: /validation/i.test(t) }; }
      return { noItemsHint: noItems, goDuringOrderIdx: order, during };
    });
    await step('C21_C23_undo_tidy_leave', async () => {
      await pg.keyboard.press('Escape'); const edges0 = await pg.locator('.react-flow__edge').count();
      const tidy = pg.getByRole('button', { name: /Tidy/i }).first(); const undo = pg.getByRole('button', { name: /Undo/i }).first(); const redo = pg.getByRole('button', { name: /Redo/i }).first();
      const r0 = { tidy: await tidy.count(), undo: await undo.count(), redo: await redo.count() };
      if (r0.tidy) { await tidy.click(); await pg.waitForTimeout(1200); }
      const edges1 = await pg.locator('.react-flow__edge').count();
      if (r0.undo) { await undo.click().catch(() => { }); await pg.waitForTimeout(800); } if (r0.redo) { await redo.click().catch(() => { }); await pg.waitForTimeout(800); }
      const edges2 = await pg.locator('.react-flow__edge').count();
      await pg.locator('header a, button[aria-label*="Back" i], a[aria-label*="Back" i]').first().click().catch(() => pg.goBack());
      await pg.waitForTimeout(2000); const t = await text(pg); await shot(pg, 'ui2-leave');
      const asked = /unsaved|discard|keep editing|leave without/i.test(t);
      const lines = t.split('\n').filter(l => /unsaved|discard|keep|leave/i.test(l)).slice(0, 4);
      const disc = pg.getByRole('button', { name: /Discard|Leave/i }).first(); if (await disc.count()) await disc.click().catch(() => { });
      await pg.waitForTimeout(1500);
      return { buttons: r0, edgesBefore: edges0, afterTidy: edges1, afterUndoRedo: edges2, askedOnLeave: asked, dialogText: lines, urlAfter: pg.url() };
    });
    await step('C22_phone', async () => {
      const p2 = await ctx.newPage(); await p2.setViewportSize({ width: 390, height: 844 });
      await p2.goto(HOST + '/settings/automation/blueprints/' + bp, { waitUntil: 'domcontentloaded', timeout: 90000 }); await p2.waitForTimeout(9000);
      const t = await text(p2); await p2.screenshot({ path: path.join(out, 'ui2-phone.png') });
      const sw = await p2.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]); await p2.close();
      return { largerScreenMsg: has(t, 'Draw states and connectors on a larger screen'), scrollWidth: sw };
    });
    await step('N7_a11y_designer', async () => {
      await pg.goto(HOST + '/settings/automation/blueprints/' + bp, { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(pg, /Save and Publish/); await pg.waitForTimeout(2000);
      const labels = await pg.evaluate(() => [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).filter(s => /diagram|drag|reorder|zoom|fit|undo|redo|node|state/i.test(s)).slice(0, 25));
      const unlabeled = await pg.evaluate(() => [...document.querySelectorAll('button')].filter(b => !b.innerText.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title') && b.offsetParent).length);
      const focus = []; for (let i = 0; i < 12; i++) { await pg.keyboard.press('Tab'); focus.push(await pg.evaluate(() => { const e = document.activeElement; return (e.getAttribute('aria-label') || e.innerText || e.tagName).trim().slice(0, 30); })); }
      return { ariaLabels: labels, iconButtonsWithoutName: unlabeled, tabOrder: focus };
    });
    await step('J_ticket_form_E4_E9', async () => {
      await pg.goto(`${HOST}/modules/${TICKETS}/records/${t1}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(pg, /Steps/); await pg.waitForTimeout(2500);
      const t0 = await text(pg); const n1 = { payloadAsText: has(t0, 'QA go ' + X), alerts: dialogs.length };
      await pg.getByRole('button', { name: /QA go/ }).first().click(); await pg.waitForTimeout(2500);
      const t = await text(pg); await shot(pg, 'ui2-form');
      const order = ['QA message', 'QA must check', 'QA optional check', 'comment', 'ttachment', 'Priority'].map(s => [s, t.indexOf(s)]);
      const runBtn = pg.getByRole('button', { name: /^Run/ }).last(); const runDisabledEmpty = await runBtn.isDisabled().catch(() => 'n/a');
      const then = (t.match(/Then:[^\n]*/) || [null])[0];
      // fill everything incl. a file
      const fp = path.join(out, 'qa-attach.txt'); fs.writeFileSync(fp, 'QA BP attachment ' + new Date().toISOString());
      const file = pg.locator('input[type=file]').first(); let fileSet = false; if (await file.count()) { await file.setInputFiles(fp); fileSet = true; await pg.waitForTimeout(4000); }
      for (const c of await pg.getByRole('checkbox').all()) { const l = await c.evaluate(e => (e.closest('label') || e.parentElement).innerText).catch(() => ''); if (/QA must check/.test(l)) await c.check().catch(() => { }); }
      const ta = pg.locator('textarea, [contenteditable=true]').first(); if (await ta.count()) { await ta.click(); await pg.keyboard.type('QA BP UI2 comment'); }
      const pri = pg.locator('xpath=//*[normalize-space(text())="Priority"]/following::*[self::button or self::select][1]').first();
      if (await pri.count()) { const tag = await pri.evaluate(e => e.tagName); if (tag === 'SELECT') await pri.selectOption({ label: 'High' }).catch(() => pri.selectOption('high')); else { await pri.click(); await pg.waitForTimeout(600); await pg.getByRole('option', { name: /^High$/i }).first().click().catch(() => { }); } }
      await pg.waitForTimeout(1000); await shot(pg, 'ui2-form-filled'); const tf = await text(pg);
      const uploadErr = tf.split('\n').filter(l => /upload|attach|fail|couldn|error|422/i.test(l)).slice(0, 6);
      const runEnabled = !(await runBtn.isDisabled().catch(() => true));
      let afterRun = null; if (runEnabled) { await runBtn.click(); await pg.waitForTimeout(6000); const ta2 = await text(pg); await shot(pg, 'ui2-after-run'); afterRun = { lines: ta2.split('\n').filter(l => /couldn|error|fail|422|ran |Escalated|attachment/i.test(l)).slice(0, 8) }; }
      const s = await tv.stateOf(t1);
      return { n1, itemOrderIdx: order, runDisabledWhenEmpty: runDisabledEmpty, then, fileInput: fileSet, uploadMessages: uploadErr, runEnabledAfterFill: runEnabled, afterRun, stateAfter: s && s.activeStates };
    });
    await step('N5_N6_arabic', async () => {
      const ctxAr = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 }, locale: 'ar' });
      await ctxAr.addInitScript(() => { try { localStorage.setItem('anyware_language', 'ar'); } catch (e) { } });
      const pa = await ctxAr.newPage();
      await pa.goto(HOST + '/settings/automation/blueprints/' + bp, { waitUntil: 'domcontentloaded', timeout: 90000 }); await pa.waitForTimeout(12000);
      const dir = await pa.evaluate(() => [document.documentElement.dir, document.documentElement.lang]); const t = await text(pa); await pa.screenshot({ path: path.join(out, 'ui2-ar-designer.png') });
      const eng = [...new Set((t.match(/\b[A-Z][a-z]{3,}(?: [a-z]{3,})*\b/g) || []))].filter(w => !/QA|Open|Escalated|Closed|Hold|Anyware|Dept|Tickets|Customers|Analytics|Activities|Chat|Community|Social|Contracts/.test(w)).slice(0, 25);
      await pa.goto(`${HOST}/modules/${TICKETS}/records/${t2}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await pa.waitForTimeout(12000);
      const t3 = await text(pa); await pa.screenshot({ path: path.join(out, 'ui2-ar-ticket.png') });
      const eng2 = [...new Set((t3.match(/\b[A-Z][a-z]{3,}(?: [a-z]{3,})*\b/g) || []))].filter(w => !/QA|Open|Escalated|Closed|Hold|Anyware|Dept/.test(w)).slice(0, 25);
      await ctxAr.close();
      return { htmlDirLang: dir, englishLeftInDesigner: eng, englishLeftOnTicket: eng2, arabicTransitionShown: has(t3, 'نقل إلى الإغلاق') || has(t, 'نقل إلى الإغلاق') };
    });
  } finally {
    await b.close();
  }
  await step('N11_chrome', async () => {
    let bc; try { bc = await chromium.launch({ headless: true, channel: 'chrome' }); } catch (e) { return { chrome: 'not installed: ' + e.message.split('\n')[0] }; }
    const c = await bc.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const p = await c.newPage();
    await p.goto(HOST + '/settings/automation/blueprints/' + bp, { waitUntil: 'domcontentloaded', timeout: 90000 }); await settle(p, /Save and Publish/);
    await p.waitForTimeout(2000); const nodes = await p.locator('.react-flow__node').count(); const edges = await p.locator('.react-flow__edge').count();
    const el = p.locator('.react-flow__node').filter({ hasText: 'On Hold' }).first(); const bx = await el.boundingBox();
    await p.mouse.move(bx.x + 20, bx.y + bx.height / 2); await p.mouse.down(); await p.mouse.move(bx.x + 120, bx.y + 140, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(800);
    const bx2 = await el.boundingBox(); await p.screenshot({ path: path.join(out, 'ui2-chrome.png') }); await bc.close();
    return { nodes, edges, dragMovedNode: Math.round(bx2.x - bx.x) + ',' + Math.round(bx2.y - bx.y) };
  });
  R.dialogs = dialogs;
  R.cleanup = await tv.cleanup(T, B);
  fs.writeFileSync(path.join(out, 'ui2-results.json'), JSON.stringify(R, null, 2)); console.log('cleanup', R.cleanup);
})().catch(async e => { console.error('ERR', e.message); console.log('cleanup', await tv.cleanup(T, B)); process.exit(1); });
