// Long-lived headed Edge for Zoho Desk (read-mostly). HTTP 127.0.0.1:8891 POST /run {code} -> runs `async (page, frame) => {...}` and returns JSON. Prints no secrets.
const http = require('http'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const b = await chromium.launch({ headless: false, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, storageState: process.argv[2] }); let page = await ctx.newPage();
  await page.goto(process.env.ZURL || 'https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  const frame = () => page.frames().find(f => /ShowHomePage|setup/i.test(f.url()) && f !== page.mainFrame()) || page.mainFrame();
  http.createServer((req, res) => { let s = ''; req.on('data', d => s += d); req.on('end', async () => {
    try { const { code } = JSON.parse(s); const fn = eval(code); const out = await fn(page, frame, ctx); res.end(JSON.stringify({ ok: true, out })); }
    catch (e) { res.end(JSON.stringify({ ok: false, err: String(e.message).slice(0, 400) })); } }); }).listen(+(process.env.ZPORT||8891), '127.0.0.1', () => console.log('zserver ready'));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
