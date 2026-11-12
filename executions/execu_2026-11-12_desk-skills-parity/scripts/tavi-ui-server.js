// Headed Edge for TAVI Desk, signed in by injecting the API token pair of <label> (no new sign-in). Port 8894, POST /run {code}.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'); const { chromium } = require(path.join(ROOT, 'node_modules/playwright-core'));
const S = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad';
const label = process.argv[2]; const T = JSON.parse(fs.readFileSync(`${S}/sk12-tok-${label.replace(/\W+/g, '_')}.json`, 'utf8'));
(async () => {
  const b = await chromium.launch({ headless: false, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } });
  await ctx.addCookies([{ name: 'aw_staging_access_token', value: T.a, domain: '.taviportal.com', path: '/' }, { name: 'aw_staging_refresh_token', value: T.r, domain: '.taviportal.com', path: '/' }]);
  await ctx.addInitScript(() => { try { localStorage.setItem('aw_auth_tenant_id', 'a7a7a7a7-0000-0000-0000-000000000004'); } catch (e) {} });
  let page = await ctx.newPage(); await page.goto('https://staging-desk.taviportal.com/', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(8000); console.log('url', page.url().replace(/\?.*/, ''));
  http.createServer((req, res) => { let s = ''; req.on('data', d => s += d); req.on('end', async () => {
    try { if (page.isClosed()) page = ctx.pages().slice(-1)[0] || await ctx.newPage(); const { code } = JSON.parse(s); const out = await eval(code)(page, ctx); res.end(JSON.stringify({ ok: true, out })); }
    catch (e) { res.end(JSON.stringify({ ok: false, err: String(e.message).slice(0, 400) })); } }); }).listen(8894, '127.0.0.1', () => console.log('tserver ready'));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
