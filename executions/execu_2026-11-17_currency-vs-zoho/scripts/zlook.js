// Read-only Zoho look: node zlook.js <url> <shotName> [clickText ...]
// Loads a COPY of the saved state (never writes it back), opens url, optionally clicks texts in order,
// saves a screenshot to zoho/<shotName>.png and prints visible text (trimmed). Clicks are for navigation/opening dialogs only.
const fs = require('fs'), path = require('path');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const RUN = path.join(P, 'executions/execu_2026-11-17_currency-vs-zoho');
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const [url, shot, ...clicks] = process.argv.slice(2);
(async () => {
  const st = JSON.parse(fs.readFileSync(path.join(RUN, 'zoho/state.json'), 'utf8'));
  const b = await chromium.launch({ headless: false, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, storageState: st });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(3000); const tt = await page.innerText('body').catch(() => ''); if (tt.length > 400 && !/^s*Loading/.test(tt)) break; }
  for (const c of clicks) {
    if (c.startsWith('goto:')) { await page.goto(c.slice(5), { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000); continue; }
    if (c.startsWith('wait:')) { await page.waitForTimeout(+c.slice(5)); continue; }
    if (c.startsWith('css:')) { await page.locator(c.slice(4)).first().click({ timeout: 15000 }); await page.waitForTimeout(3000); continue; }
    if (c.startsWith('scroll:')) { await page.mouse.move(800, 600); await page.mouse.wheel(0, +c.slice(7)); await page.waitForTimeout(1500); continue; }
    const loc = page.getByText(c, { exact: true });
    await loc.first().click({ timeout: 15000 }); await page.waitForTimeout(3500);
  }
  await page.screenshot({ path: path.join(RUN, 'zoho', shot + '.png') });
  const t = await page.innerText('body').catch(() => '');
  console.log('URL', page.url().replace(/[?].*$/, ''));
  console.log(t.replace(/\n{2,}/g, '\n').slice(0, +(process.env.MAXT || 5000)));
  await b.close();
})().catch(e => { console.error('ERR', e.message.split('\n')[0]); process.exit(1); });
