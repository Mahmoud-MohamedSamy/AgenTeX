// Sign in to TAVI CRM (staging-crm.taviportal.com) and save storage state. No secret is printed.
// Credentials: docs/Credentials/Microsoft Edge Passwords.csv (user's instruction 18 Oct 2026), rows for staging-crm.taviportal.com.
// Usage: node login.js list            -> prints the usernames available (no passwords)
//        node login.js <username> <outStateFile>
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const H = 'https://staging-crm.taviportal.com';
const parse = s => { const rows = []; let row = [], f = '', q = false; for (let i = 0; i < s.length; i++) { const ch = s[i];
  if (q) { if (ch === '"' && s[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; }
  else if (ch === '"') q = true; else if (ch === ',') { row.push(f); f = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && s[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; } else f += ch; }
  if (f || row.length) { row.push(f); rows.push(row); } return rows; };
const rows = parse(fs.readFileSync(path.join(P, 'docs/Credentials/Microsoft Edge Passwords.csv'), 'utf8'));
// The export has NO header row: columns are name, url, username, password.
const ix = n => ({ name: 0, url: 1, username: 2, password: 3 })[n];
const accts = rows.filter(r => /staging-crm\.taviportal\.com/i.test(r[ix('url')] || '')).map(r => ({ user: r[ix('username')], pw: r[ix('password')] }));
const [who, out] = process.argv.slice(2);
if (who === 'list') { console.log([...new Set(accts.map(a => a.user))].join('\n') || 'none'); process.exit(0); }
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const a = accts.find(x => x.user === who); if (!a) throw new Error('no such account in file');
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const UA = process.env.UA; const ctx = await b.newContext(UA ? { userAgent: UA, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto(H + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('input[autocomplete~="username"]', { timeout: 40000 });
  await page.fill('input[autocomplete~="username"]', a.user); await page.fill('input[autocomplete="current-password"]', a.pw);
  await page.locator('form button[type=submit]').first().click();
  for (let i = 0; i < 90; i++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => '');
    if (/invalid email or password/i.test(t)) break;
    if (await page.$('text=NDC-Staging') && /organi[sz]ation/i.test(t)) await page.click('text=NDC-Staging').catch(() => {});
    if (!/sign in crm|signing in/i.test(t)) break; }
  await page.waitForTimeout(5000);
  const t = await page.innerText('body').catch(() => '');
  if (/sign in crm|signing in|invalid email/i.test(t)) { await page.screenshot({ path: out + '.fail.png' }); throw new Error('not signed in: ' + page.url()); }
  await ctx.storageState({ path: out }); console.log('signed in, URL', page.url()); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
