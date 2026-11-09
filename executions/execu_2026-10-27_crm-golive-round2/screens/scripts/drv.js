// Screen-checks lane (Round 2 Phase 3): ONE long-lived Edge per account. Signs in ONCE, keeps the session in memory only
// (no storage state, no token on disk), then runs snippets sent to http://127.0.0.1:<port>/run.
// Usage: node drv.js <tavi|zoho> <email-or-row> <port>
// Snippet = body of async ({page, ctx, api, out, RAW, sleep, B}) => {...}; it returns nothing, fills `out`.
// Passwords are read from the credential files and never printed.
require('dns').setDefaultResultOrder('ipv4first');
const path = require('path'), fs = require('fs'), http = require('http');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RAW = path.join(P, 'executions/execu_2026-10-27_crm-golive-round2/screens/evidence/raw') + '/';
const [kind, who, port] = process.argv.slice(2);
const B = 'https://staging-crm.taviportal.com', TENANT = 'a7a7a7a7-0000-0000-0000-000000000004';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let page, ctx, browser;

function taviPw(email) {
  const row = fs.readFileSync(path.join(P, 'docs/Credentials/Microsoft Edge Passwords.csv'), 'utf8').replace(/^\uFEFF/, '')
    .split(/\r?\n/).map(l => l.split(',')).find(c => c[0] === 'staging-crm.taviportal.com' && c[2] === email);
  if (!row) throw new Error('no credentials row for that account');
  return row.slice(3).join(',');
}
function zohoCred(n) {
  const lines = fs.readFileSync(path.join(P, 'docs/Credentials/Zoho Desk Credentials.csv'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const l = lines[Number(n)]; const i = l.indexOf(',');
  return { email: l.slice(0, i), pw: l.slice(i + 1) };
}

async function signInTavi(email) {
  await page.goto(B + '/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('input[type=email]', { timeout: 60000 });
  await page.fill('input[type=email]', email); await page.fill('input[type=password]', taviPw(email));
  await page.locator('button[type=submit]').first().click();
  for (let i = 0; i < 60; i++) {
    await sleep(1000);
    if (!/\/login/.test(page.url())) break;
    const t = await page.innerText('body').catch(() => '');
    if (/too many|429/i.test(t)) { console.log('STOP 429 on sign-in'); process.exit(3); }
    if (/Choose an organization/.test(t)) await page.click('text=Wonder Travel').catch(() => {});
  }
  await sleep(4000);
  console.log('signed in; url', page.url());
}
async function signInZoho(n) {
  const c = zohoCred(n);
  await page.goto('https://accounts.zoho.com/signin?servicename=ZohoCRM', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.fill('#login_id', c.email); await page.click('#nextbtn');
  await page.waitForSelector('#password', { timeout: 30000 }); await sleep(800);
  await page.fill('#password', c.pw); await page.click('#nextbtn');
  for (let i = 0; i < 40; i++) { await sleep(1500); if (/crm\.zoho\.com/.test(page.url())) break; }
  console.log('zoho url', page.url().slice(0, 60));
}

const api = (m, u, body) => page.evaluate(async ([m, u, bd, t]) => {
  const tok = decodeURIComponent((document.cookie.match(/aw_staging_access_token=([^;]+)/) || [, ''])[1]);
  const t0 = performance.now();
  const r = await fetch('/api/v1' + u, { method: m, credentials: 'include', headers: { 'Content-Type': 'application/json', 'x-tenant-id': t, 'x-app-key': 'crm', Authorization: 'Bearer ' + tok }, body: bd ? JSON.stringify(bd) : undefined });
  const txt = await r.text(); let j = null; try { j = JSON.parse(txt); } catch (e) {}
  return { s: r.status, ms: Math.round(performance.now() - t0), j, t: txt.slice(0, 3000) };
}, [m, u, body, TENANT]);

(async () => {
  browser = await chromium.launch({ headless: process.env.HEADED ? false : true, channel: 'msedge' });
  ctx = await browser.newContext({ viewport: { width: 1600, height: 950 }, acceptDownloads: true });
  page = await ctx.newPage();
  if (kind === 'tavi') await signInTavi(who); else await signInZoho(who);
  const AF = Object.getPrototypeOf(async function () {}).constructor;
  http.createServer((req, res) => {
    let s = ''; req.on('data', d => s += d); req.on('end', async () => {
      const out = {};
      try {
        if (page.isClosed()) page = await ctx.newPage();
        const fn = new AF('ctx', 'page', 'api', 'out', 'RAW', 'sleep', 'B', 'require', s);
        await fn(ctx, page, api, out, RAW, sleep, B, require);
      } catch (e) { out.__error = String(e && e.message || e).split('\n').slice(0, 3).join(' | '); }
      res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(out));
    });
  }).listen(Number(port), '127.0.0.1', () => console.log('ready on', port));
})().catch(e => { console.error('ERR', String(e.message).split('\n')[0]); process.exit(1); });
