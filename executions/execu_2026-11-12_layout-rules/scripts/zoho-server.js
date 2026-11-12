// Long-lived headed Edge for Zoho (one account: CRM org944965048 + Desk). Signs in once, saves state to scratchpad. Prints no secret.
// POST 127.0.0.1:<port>/run {code}: `async (page, ctx, h) => {...}` ; h.crmApi(method, path, body) uses the CRM session cookie.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const { chromium } = require(path.join(ROOT, 'node_modules/playwright-core'));
const PORT = +process.argv[2] || 8897;
const STATE = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/475a6ffc-8477-4038-8e22-fc2c2fe0fef0/scratchpad/state-zoho-lr.json';
(async () => {
  const b = await chromium.launch({ headless: false, channel: 'msedge', args: ['--disable-gpu'] });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, ...(fs.existsSync(STATE) ? { storageState: STATE } : {}) });
  let page = await ctx.newPage();
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(6000);
  if (/accounts\.zoho/.test(page.url())) {
    const rows = fs.readFileSync(path.join(ROOT, 'docs/Credentials/Zoho hmohamed@anyware.software.txt'), 'utf8').split(/\r?\n/);
    await page.fill('#login_id', rows[0].trim()); await page.click('#nextbtn');
    await page.waitForSelector('#password', { state: 'visible', timeout: 30000 });
    await page.fill('#password', rows[1].trim()); await page.click('#nextbtn');
    for (let k = 0; k < 180; k++) { await page.waitForTimeout(1000); if (/crm\.zoho\.com\/crm\//.test(page.url())) break; }
  }
  await page.waitForTimeout(5000);
  console.log('url', page.url().replace(/\?.*/, '').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '<email>'));
  await ctx.storageState({ path: STATE }).catch(() => {});
  const crmApi = async (method, p, body) => page.evaluate(async ({ method, p, body }) => {
    const m = document.cookie.match(/crmcsr=([^;]+)/); const tok = m ? m[1] : '';
    const r = await fetch(p, { method, headers: { 'Content-Type': 'application/json', 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + tok, 'X-CRM-ORG': '944965048' }, body: body ? JSON.stringify(body) : undefined, credentials: 'include' });
    return { status: r.status, body: (await r.text()).slice(0, 20000) };
  }, { method, p, body });
  http.createServer((req, res) => { let s = ''; req.on('data', d => s += d); req.on('end', async () => {
    try { if (page.isClosed()) page = ctx.pages().slice(-1)[0] || await ctx.newPage(); const { code } = JSON.parse(s);
      const out = await eval(code)(page, ctx, { crmApi: (m, p, b) => crmApi(m, p, b) }); await ctx.storageState({ path: STATE }).catch(() => {});
      res.end(JSON.stringify({ ok: true, out })); }
    catch (e) { res.end(JSON.stringify({ ok: false, err: String(e.message).split('Call log')[0].slice(0, 500) })); } }); }).listen(PORT, '127.0.0.1', () => console.log('zoho ready ' + PORT));
})().catch(e => { console.error('ERR', e.message.slice(0, 200)); process.exit(1); });
