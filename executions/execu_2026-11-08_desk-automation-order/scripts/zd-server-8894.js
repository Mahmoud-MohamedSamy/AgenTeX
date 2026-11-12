// Long-lived headed Edge for Zoho Desk (techsolutionsegypt). Signs in once if no state (row 1 of Zoho Desk Credentials.csv), saves state.
// HTTP 127.0.0.1:8894 POST /run {code} runs `async (page, frame, ctx) => {...}`. Prints no secret.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const { chromium } = require(path.join(ROOT, 'node_modules/playwright-core'));
const STATE = process.argv[2];
(async () => {
  const b = await chromium.launch({ headless: false, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, ...(fs.existsSync(STATE) ? { storageState: STATE } : {}) });
  let page = await ctx.newPage();
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(6000);
  if (/accounts\.zoho/.test(page.url())) {
    // user's file: line 1 = email, line 2 = password (12 Nov 2026)
    const rows = fs.readFileSync(path.join(ROOT, 'docs/Credentials/Zoho hmohamed@anyware.software.txt'), 'utf8').split(/\r?\n/);
    await page.fill('#login_id', rows[0].trim()); await page.click('#nextbtn');
    await page.waitForSelector('#password', { state: 'visible', timeout: 30000 });
    await page.fill('#password', rows[1].trim()); await page.click('#nextbtn');
    for (let k = 0; k < 240; k++) { await page.waitForTimeout(1000); if (/desk\.zoho\.com\/agent\//.test(page.url())) break;
      const s = page.locator('text=/Remind me later|Skip for now|I understand|Not now/i'); if (await s.count()) await s.first().click().catch(() => {}); }
    console.log('after login url host', new URL(page.url()).host);
  }
  await page.waitForTimeout(5000); await ctx.storageState({ path: STATE });
  const frame = () => page.frames().find(f => /setup/i.test(f.url()) && f !== page.mainFrame()) || page.mainFrame();
  http.createServer((req, res) => { let s = ''; req.on('data', d => s += d); req.on('end', async () => {
    try { const { code } = JSON.parse(s); if (page.isClosed()) page = ctx.pages().slice(-1)[0] || await ctx.newPage(); const fn = eval(code); const out = await fn(page, frame, ctx); await ctx.storageState({ path: STATE }); res.end(JSON.stringify({ ok: true, out })); }
    catch (e) { res.end(JSON.stringify({ ok: false, err: String(e.message).slice(0, 400) })); } }); }).listen(8894, '127.0.0.1', () => console.log('zserver ready'));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
