// NDC-2621 screen retest (28 Oct 2026), CRM Admin A, ONE saved browser session (tlogin.js state; no sign-in here).
// 1. two QA deals on pipeline Standard are created by in-page fetch (the app's own cookies);
// 2. record page: Change pipeline → "1" + its first stage → Confirm; screenshot dialog + result;
// 3. list: select deal 2 → Mass Update › Pipeline → "1" + stage → Update; screenshot;
// 4. read both deals back; delete them. Usage: node ui-2621.js <state.json>
require('dns').setDefaultResultOrder('ipv4first');
const path = require('path'), fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RAW = path.join(P, 'executions/execu_2026-10-27_crm-golive-round2/wave3/evidence/raw');
const BASE = 'https://staging-crm.taviportal.com', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', LAYOUT = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
const STD = '5170500c-b335-479c-96d1-ed138965c345', ONE = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b', TENANT = 'a7a7a7a7-0000-0000-0000-000000000004';
const log = [];
const note = s => { log.push(s); console.log(s); };

(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 950 }, storageState: process.argv[2] });
  const pg = await ctx.newPage();
  await pg.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await pg.waitForTimeout(5000);
  const api = (method, url, body) => pg.evaluate(async ([m, u, bd, t]) => {
    const r = await fetch('/api/v1' + u, { method: m, credentials: 'include', headers: { 'Content-Type': 'application/json', 'x-tenant-id': t, 'x-app-key': 'crm', Authorization: 'Bearer ' + decodeURIComponent((document.cookie.match(/aw_staging_access_token=([^;]+)/) || [, ''])[1]) }, body: bd ? JSON.stringify(bd) : undefined });
    return { s: r.status, t: (await r.text()).slice(0, 4000) };
  }, [method, url, body, TENANT]);
  const s = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
  const pipe = async id => { const r = await api('GET', `/modules/${DEALS}/records/${id}`); const d = JSON.parse(r.t).data.data; const f = k => ((d.find(e => e.field === k) || {}).value || {}).value; return `${f('pipeline')} / ${f('stage')}`; };
  const ids = [];
  for (const n of ['QA R2W3 PL ui edit', 'QA R2W3 PL ui mass']) {
    const r = await api('POST', `/modules/${DEALS}/records`, { layout_id: LAYOUT, data: [s('name', n), s('deal_name', n), s('pipeline', STD), s('stage', 'qualification')] });
    const id = r.s < 300 ? JSON.parse(r.t).data.id : null; ids.push(id);
    note(`create "${n}" -> ${r.s} ${id || r.t.slice(0, 200)}`);
  }
  try {
    // record page
    await pg.goto(`${BASE}/modules/${DEALS}/records/${ids[0]}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await pg.waitForTimeout(8000);
    await pg.screenshot({ path: path.join(RAW, 't-2621-record-before.png') });
    const body = await pg.innerText('body');
    note('record page shows: ' + (body.match(/Standard[^\n]{0,40}/) || ['(no Standard text)'])[0]);
    const dd = pg.getByText('Standard (Default)', { exact: true }).first();
    note('pipeline dropdown found: ' + await dd.count());
    {
      if (await dd.count()) await dd.click(); else await pg.mouse.click(474, 364);
      await pg.waitForTimeout(1500);
      await pg.screenshot({ path: path.join(RAW, 't-2621-dropdown.png') });
      const opts = pg.locator('[role=option], [role=menuitem], [role=menuitemradio], [role=listbox] li');
      const texts = await opts.allInnerTexts(); note('pipeline options: ' + texts.map(t => t.replace(/s+/g, ' ')).join(' | '));
      let picked = false;
      for (let t = 0; t < 10 && !picked; t++) {
        const cands = pg.getByText('1', { exact: true });
        for (let c = 0; c < await cands.count() && !picked; c++) {
          const bb = await cands.nth(c).boundingBox().catch(() => null);
          if (bb && bb.x > 360 && bb.x < 600 && bb.y > 380 && bb.y < 480) { await cands.nth(c).click(); picked = true; }
        }
        if (!picked) await pg.waitForTimeout(500);
      }
      note('menu option 1 picked: ' + picked);
      await pg.waitForTimeout(2500);
      await pg.screenshot({ path: path.join(RAW, 't-2621-dialog.png') });
      const dlg = pg.locator('[role=dialog], [role=alertdialog]').last();
      note('dialog text: ' + (await dlg.innerText().catch(() => '')).replace(/s+/g, ' ').slice(0, 300));
      const combos = dlg.locator('[role=combobox], select');
      for (let c = 0; c < await combos.count(); c++) {
        const el = combos.nth(c); const tag = await el.evaluate(e => e.tagName);
        if (tag === 'SELECT') { const o = await el.locator('option').allInnerTexts(); note('stage options: ' + o.join(' | ')); const w = o.find(x => x.trim() && !/select/i.test(x)); if (w) await el.selectOption({ label: w }); }
        else { await el.click(); await pg.waitForTimeout(1200); const o = pg.locator('[role=option]'); const ot = await o.allInnerTexts(); note('stage options: ' + ot.join(' | ')); if (ot.length) await o.first().click(); await pg.waitForTimeout(1200); }
      }
      await pg.screenshot({ path: path.join(RAW, 't-2621-dialog-filled.png') });
      const ok = dlg.getByRole('button', { name: /confirm|change|save|move|ok/i }).last();
      if (await ok.count()) { await ok.click(); await pg.waitForTimeout(6000); }
      await pg.screenshot({ path: path.join(RAW, 't-2621-record-after.png') });
      note('after record-page move: ' + await pipe(ids[0]) + '; dialog still open: ' + (await pg.locator('[role=dialog], [role=alertdialog]').count() > 0));
    }

    // mass update from the list
    await pg.goto(`${BASE}/modules/${DEALS}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await pg.waitForTimeout(8000);
    await pg.mouse.click(1429, 165); await pg.waitForTimeout(5000);   // list view (the module opened in Kanban)
    await pg.screenshot({ path: path.join(RAW, 't-2621-list.png') });
    await pg.mouse.click(285, 302); await pg.waitForTimeout(2000);   // row 1 = newest = "QA R2W3 PL ui mass" (sorted Created At desc)
    await pg.screenshot({ path: path.join(RAW, 't-2621-selected.png') });
    const btns = (await pg.locator('button').allInnerTexts()).map(t => t.trim()).filter(Boolean);
    note('buttons after select: ' + btns.filter(t => t.length < 30).join(' | '));
    let mu = pg.getByRole('button', { name: /mass update|^update$/i }).first();
    if (!(await mu.count())) { await pg.mouse.click(1372, 97); await pg.waitForTimeout(1500); await pg.screenshot({ path: path.join(RAW, 't-2621-more-menu.png') });
      note('menu items: ' + (await pg.locator('[role=menuitem]').allInnerTexts()).join(' | ')); mu = pg.getByText(/mass update/i).first(); }
    if (await mu.count()) {
      await mu.click(); await pg.waitForTimeout(2500);
      await pg.screenshot({ path: path.join(RAW, 't-2621-mass-open.png') });
      note('mass update dialog: ' + (await pg.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/s+/g, ' ').slice(0, 400));
      const dlg = pg.locator('[role=dialog]').last();
      await dlg.getByText('Choose a field').first().click(); await pg.waitForTimeout(1200);
      note('field options: ' + (await pg.locator('[role=option], [role=menuitem]').allInnerTexts()).map(t => t.trim()).join(' | ').slice(0, 400));
      await pg.getByRole('option', { name: /^Pipeline$/ }).or(pg.getByRole('menuitem', { name: /^Pipeline$/ })).first().click(); await pg.waitForTimeout(1500);
      await pg.screenshot({ path: path.join(RAW, 't-2621-mass-field.png') });
      note('after choosing Pipeline: ' + (await dlg.innerText()).replace(/s+/g, ' ').slice(0, 300));
      const ctl = dlg.locator('[role=combobox], select, button:has-text("Select")');
      note('value controls: ' + await ctl.count());
      for (let c = 0; c < await ctl.count(); c++) {
        const el = ctl.nth(c); const tag = await el.evaluate(e => e.tagName);
        if (tag === 'SELECT') { const o = await el.locator('option').allInnerTexts(); note('select ' + c + ': ' + o.join(' | ')); const w = c === 0 ? o.find(x => /^s*1/.test(x)) : o.find(x => x.trim() && !/select/i.test(x)); if (w) await el.selectOption({ label: w }); }
        else { const txt = (await el.innerText().catch(() => '')).trim(); if (/Pipeline/.test(txt)) continue; await el.click(); await pg.waitForTimeout(1200); const o = pg.locator('[role=option]'); const ot = (await o.allInnerTexts()).map(t => t.trim()); note('control ' + c + ' (' + txt + '): ' + ot.join(' | '));
          let k = ot.findIndex(t => /^1$/.test(t)); if (k < 0) k = ot.findIndex(t => t && !/standard/i.test(t)); if (k >= 0) await o.nth(k).click(); await pg.waitForTimeout(1200); }
      }
      await pg.screenshot({ path: path.join(RAW, 't-2621-mass-filled.png') });
      await dlg.getByRole('button', { name: /Update records/ }).click(); await pg.waitForTimeout(6000);
      await pg.screenshot({ path: path.join(RAW, 't-2621-mass-after.png') });
      note('after mass update: ' + await pipe(ids[1]) + '; dialog still open: ' + (await pg.locator('[role=dialog]').count() > 0) + '; dialog text: ' + (await pg.locator('[role=dialog]').last().innerText().catch(() => '-')).replace(/s+/g, ' ').slice(0, 200));
    } else note('no Mass Update control after selecting the row');
  } finally {
    for (const id of ids.filter(Boolean)) note(`delete ${id} -> ${(await api('DELETE', `/modules/${DEALS}/records/${id}`)).s}`);
    fs.writeFileSync(path.join(RAW, 't-2621-log.txt'), log.join('\n') + '\n');
    await b.close();
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
