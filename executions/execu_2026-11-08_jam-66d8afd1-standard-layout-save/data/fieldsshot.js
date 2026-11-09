// Read-only: open Tickets › Fields tab and screenshot it. Blocks every write just in case.
const path = require('path');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const H = 'https://staging-desk.taviportal.com', MID = '88e8ea44-1658-4df3-9930-d0902b91073d';
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: process.argv[2], viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await ctx.route('**/api/v1/**', r => ['PUT', 'PATCH', 'DELETE'].includes(r.request().method()) ? r.abort() : r.continue());
  await page.goto(`${H}/settings/modules-and-fields/${MID}`, { waitUntil: 'commit', timeout: 180000 });
  await page.getByText('Layouts', { exact: true }).first().waitFor({ timeout: 90000 }); await page.waitForTimeout(2000);
  await page.getByText('Fields', { exact: true }).first().click(); await page.waitForTimeout(5000);
  const s = page.getByPlaceholder(/search/i).filter({ visible: true }); if (await s.count()) { await s.last().fill('mail'); await page.waitForTimeout(3000); }
  await page.screenshot({ path: `${S}/fields-email.png` });
  const t = await page.innerText('body'); console.log('has Email:', /\bEmail\b/.test(t), '| has test label:', /\btest\b/.test(t));
  await ctx.storageState({ path: process.argv[2] }); await b.close();
})().catch(e => { console.error('ERR', String(e.message).split('Call log:')[0].slice(0, 300)); process.exit(1); });
