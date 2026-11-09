// node repro.js <state> <variant: create|detailFirst>
// Opens the Standard ticket layout builder, makes an in-memory label edit, clicks Save.
// EVERY mutating /api/v1 request is aborted (nothing is written); its body is captured.
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const H = 'https://staging-desk.taviportal.com';
const MID = '88e8ea44-1658-4df3-9930-d0902b91073d', LID = '1b55c25d-eb27-4046-afd1-b292398b435b';
const [state, variant] = process.argv.slice(2);
const names = v => v && v.layout ? (v.layout.sections || []).flatMap(s => (s.columns || []).flatMap(c => (c.fields || []).map(f => f.apiName || f.fieldName))) : null;
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: state, viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  const caught = []; const gets = [];
  await ctx.route('**/api/v1/**', async route => { const r = route.request(); const m = r.method();
    if ((['PUT', 'PATCH', 'DELETE'].includes(m) || (m === 'POST' && /\/modules\//.test(r.url()) && !/query|search|resolved|batch-get/.test(r.url()))) && !/\/iam\//.test(r.url())) { caught.push({ m, u: r.url().replace(H, ''), body: r.postData() });
      // Fake a success for the label PATCH (nothing reaches the server) so the editor goes on to send the layout PUT.
      const lm = r.url().match(/\/fields\/([0-9a-f-]{36})\/labels$/);
      if (m === 'PATCH' && lm) { const F = JSON.parse(fs.readFileSync(`${S}/ticket-fields.json`, 'utf8')).find(x => x.id === lm[1]) || { id: lm[1] }; const body = JSON.parse(r.postData() || '{}');
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { ...F, labels: body.labels || F.labels }, error: {}, meta: {} }) }); }
      return route.abort(); }
    return route.continue(); });
  page.on('response', async r => { if (r.request().method() === 'GET' && r.url().includes(`/layouts/${LID}`)) { try { gets.push(await r.json()); } catch (e) { } } });
  await page.goto(`${H}/settings/modules-and-fields/${MID}/layouts/${LID}`, { waitUntil: 'commit', timeout: 180000 });
  await page.getByText('Ticket Information').first().waitFor({ timeout: 90000 }); await page.waitForTimeout(3000);
  await page.screenshot({ path: `${S}/repro-${variant}-1-open.png` });
  if (variant === 'detailFirst') { await page.getByText('DETAIL VIEW', { exact: true }).first().click(); await page.waitForTimeout(2500); await page.screenshot({ path: `${S}/repro-${variant}-2-detail.png` });
    await page.getByText('CREATE', { exact: true }).first().click(); await page.waitForTimeout(2000); }
  if (variant === 'detailShot') { await page.getByText('DETAIL VIEW', { exact: true }).first().click(); await page.waitForTimeout(2500); await page.screenshot({ path: `${S}/repro-${variant}-2-detail.png`, fullPage: true }); const t = await page.innerText('body'); console.log('detail tab shows Resolution:', /Resolution/.test(t)); await b.close(); return; }
  // In-memory label edit, same gesture as the Jam (click label cell, Ctrl+A, type, Enter)
  const lab = page.getByText('Phone', { exact: true }).filter({ visible: true });
  let ok = false; for (let i = 0; i < await lab.count(); i++) { const bb = await lab.nth(i).boundingBox(); if (bb && bb.x > 345) { await lab.nth(i).click(); ok = true; break; } }
  if (!ok) throw new Error('Phone label not found on canvas');
  await page.waitForTimeout(800); await page.keyboard.press('Control+a'); await page.keyboard.type('Phone QA'); await page.keyboard.press('Enter'); await page.waitForTimeout(1000);
  await page.screenshot({ path: `${S}/repro-${variant}-3-edited.png` });
  await page.getByRole('button', { name: /^Save$/ }).first().click(); await page.waitForTimeout(5000);
  await page.screenshot({ path: `${S}/repro-${variant}-4-after-save.png` });
  const out = { variant, caught: caught.map(c => ({ m: c.m, u: c.u, size: (c.body || '').length })) };
  const put = caught.find(c => c.m === 'PUT' && c.u.includes(`/layouts/${LID}`));
  if (put) { fs.writeFileSync(`${S}/repro-${variant}-put-body.json`, put.body); const j = JSON.parse(put.body); out.putViewKeys = Object.keys(j.views || {});
    for (const k of Object.keys(j.views || {})) { const n = names(j.views[k]); out['put_' + k] = n && { count: n.length, hasResolution: n.includes('resolution'), fields: n }; } }
  const stored = gets[0] && gets[0].data; if (stored) for (const k of Object.keys(stored.views || {})) { const n = names(stored.views[k]); out['stored_' + k] = n && n.length; }
  console.log(JSON.stringify(out, null, 1)); await b.close();
})().catch(e => { console.error('ERR', String(e.message).split('Call log:')[0].slice(0, 300)); process.exit(1); });
