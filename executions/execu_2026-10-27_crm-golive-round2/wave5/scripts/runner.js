// Round 2 Wave 5 runner: ONE long-running process. It signs CRM Admin A in ONCE through the TAVI login page (headless Edge)
// and, on request, the Zoho reference org ONCE (Edge, read-only use). Tokens stay in memory only: no storage state is saved,
// nothing is printed. API calls use the browser's access cookie as a Bearer token (as in round 1).
// POST http://127.0.0.1:47835/run {"file": "<abs snippet>", "out": "<abs json>"}  — snippet = body of an async function
//   with (page, ctx, call, out, shot, zpage, sleep). A 429 anywhere stops the runner for good.
// POST /zoho  — signs in to Zoho once.  POST /stop — exit.
require('dns').setDefaultResultOrder('ipv4first');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const W5 = ROOT + '/executions/execu_2026-10-27_crm-golive-round2/wave5';
const { chromium } = require(path.join(ROOT, 'node_modules/playwright-core'));
const H = 'https://staging-crm.taviportal.com', B = H + '/api/v1', T = 'a7a7a7a7-0000-0000-0000-000000000004';
const EMAIL = process.env.CRM_USER || 'mmohamed@anyware.software';
let stopped = null, browser, ctx, page, zctx, zpage;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function crmPw(e) {
  for (const l of fs.readFileSync(path.join(ROOT, 'docs/Credentials/Microsoft Edge Passwords.csv'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const c = l.split(','); if (c[0] === 'staging-crm.taviportal.com' && c[2] === e) return c.slice(3).join(',');
  }
  throw new Error('no credentials for ' + e);
}
async function signIn() {
  browser = await chromium.launch({ headless: true, channel: 'msedge' });
  ctx = await browser.newContext({ viewport: { width: 1600, height: 950 } });
  page = await ctx.newPage();
  await page.goto(H + '/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('input[type=email]', { timeout: 60000 });
  await page.fill('input[type=email]', EMAIL); await page.fill('input[type=password]', crmPw(EMAIL));
  const resp = page.waitForResponse(r => r.url().includes('/iam/auth/login'), { timeout: 60000 }).catch(() => null);
  await page.locator('button[type=submit]').first().click();
  const r = await resp;
  if (r && r.status() === 429) { stopped = 'STOP: 429 on sign-in for ' + EMAIL; console.log('[runner] ' + stopped); return; }
  for (let i = 0; i < 60; i++) {
    await sleep(1000);
    if (!/\/login/.test(page.url())) break;
    const t = await page.innerText('body').catch(() => '');
    if (/too many|429/i.test(t)) { stopped = 'STOP: 429 text on login page'; console.log('[runner] ' + stopped); return; }
    if (/Choose an organization/.test(t)) {
      console.log('[runner] org picker: ' + t.replace(/\s+/g, ' ').slice(0, 400));
      await page.click('text=' + (process.env.ORG || 'NDC-Staging')).catch(() => {});
      await sleep(800); await page.click('text=Continue').catch(() => {});
    }
  }
  await sleep(4000);
  console.log('[runner] signed in once as ' + EMAIL + ' -> ' + page.url().replace(H, '') + ' tenant ' + await page.evaluate(() => localStorage.getItem('aw_auth_tenant_id')).catch(() => '?'));
}
async function tok() {
  const c = (await ctx.cookies()).find(x => x.name === 'aw_staging_access_token');
  return c ? c.value : null;
}
async function refreshViaApp() {
  // let the app refresh its own session (no new sign-in): reload a page and wait for the cookie to change
  const before = await tok();
  await page.goto(H + '/home', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  for (let i = 0; i < 20; i++) { await sleep(1000); const n = await tok(); if (n && n !== before) return; }
}
async function call(m, p, body, extra) {
  if (stopped) throw new Error(stopped);
  for (let a = 0; ; a++) {
    let t = await tok();
    if (!t) { await refreshViaApp(); t = await tok(); }
    const r = await ctx.request.fetch((p.startsWith('http') ? '' : B) + p, { method: m, timeout: 120000, failOnStatusCode: false,
      headers: { authorization: 'Bearer ' + t, 'x-tenant-id': T, 'x-app-key': 'crm', ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...(extra || {}) },
      data: body !== undefined ? JSON.stringify(body) : undefined }).catch(e => ({ status: () => 599, text: async () => 'NETWORK ' + e.message.split('\n')[0] }));
    const s = r.status();
    if (s === 429) { stopped = 'STOP: 429 on ' + m + ' ' + p; console.log('[runner] ' + stopped); throw new Error(stopped); }
    if (s === 401 && a < 2) { await refreshViaApp(); continue; }
    if ((s === 502 || s === 503 || s === 504 || s === 599) && a < 3) { await sleep(4000 * (a + 1)); continue; }
    const tx = await r.text(); let j = null; try { j = JSON.parse(tx); } catch (e) {}
    return { s, j, t: tx.slice(0, 4000) };
  }
}
async function shot(name, p) { const f = W5 + '/evidence/raw/' + name + '.png'; await (p || page).screenshot({ path: f }); return f; }
function zohoCred() {
  const lines = fs.readFileSync(path.join(ROOT, 'docs/Credentials/Zoho Desk Credentials.csv'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
  const l = lines[1]; const i = l.indexOf(','); return { u: l.slice(0, i).trim(), p: l.slice(i + 1).trim().replace(/^"|"$/g, '') };
}
async function zohoLogin() {
  if (zpage) return 'already signed in';
  const zb = await chromium.launch({ headless: true, channel: 'msedge' });
  zctx = await zb.newContext({ viewport: { width: 1600, height: 950 } }); zpage = await zctx.newPage();
  const c = zohoCred();
  await zpage.goto('https://accounts.zoho.com/signin?servicename=ZohoCRM&serviceurl=https%3A%2F%2Fcrm.zoho.com%2Fcrm%2Forg943261092%2Ftab%2FHome%2Fbegin', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await zpage.fill('#login_id', c.u); await zpage.click('#nextbtn'); await sleep(2500);
  await zpage.fill('#password', c.p); await zpage.click('#nextbtn');
  for (let i = 0; i < 40; i++) { await sleep(2000); if (/crm\.zoho\.com\/crm/.test(zpage.url())) break; }
  await sleep(5000);
  return 'zoho at ' + zpage.url();
}
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
http.createServer((req, res) => {
  let body = ''; req.on('data', c => body += c); req.on('end', async () => {
    try {
      if (req.url === '/stop') { res.end('bye'); try { await browser.close(); } catch (e) {} setTimeout(() => process.exit(0), 200); return; }
      if (stopped) throw new Error(stopped);
      if (req.url === '/zoho') { res.end(await zohoLogin()); return; }
      const q = JSON.parse(body);
      const fn = new AsyncFunction('page', 'ctx', 'call', 'out', 'shot', 'zpage', 'sleep', 'H', fs.readFileSync(q.file, 'utf8'));
      const out = {};
      let result;
      try { result = await fn(page, ctx, call, out, shot, zpage, sleep, H); } catch (e) { out.__error = e.message.split('\n')[0]; }
      const json = JSON.stringify(result === undefined ? out : result, null, 1);
      if (q.out) fs.writeFileSync(q.out, json);
      res.end(json.length > 7000 ? json.slice(0, 7000) + '\n...(truncated; full result in ' + q.out + ')' : json);
    } catch (e) { res.statusCode = 500; res.end('ERR ' + e.message.split('\n')[0]); }
  });
}).listen(47835, '127.0.0.1', async () => {
  console.log('[runner] listening on 127.0.0.1:47835');
  try { await signIn(); } catch (e) { console.log('[runner] sign-in error ' + e.message.split('\n')[0]); }
});
