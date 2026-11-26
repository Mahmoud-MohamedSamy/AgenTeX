// Round 12: sign in to TAVI (CRM or Desk) and save storage state. No secret is printed.
// Credentials: docs/Credentials/TAVI Desk Credentials.csv (header: name,username,password) — read by column name.
// Usage: node login-r12.js <crm|desk> <username> <outStateFile>     (ORG env picks the organisation, default NDC-Staging)
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const parse = s => { const rows = []; let row = [], f = '', q = false; for (let i = 0; i < s.length; i++) { const ch = s[i];
  if (q) { if (ch === '"' && s[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; }
  else if (ch === '"') q = true; else if (ch === ',') { row.push(f); f = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && s[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; } else f += ch; }
  if (f || row.length) { row.push(f); rows.push(row); } return rows; };
const [app, who, out] = process.argv.slice(2);
const H = app === 'desk' ? 'https://staging-desk.taviportal.com' : 'https://staging-crm.taviportal.com';
const rows = parse(fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8')).filter(r => r.length > 1);
const hdr = rows[0].map(x => x.trim().toLowerCase()); const U = hdr.indexOf('username'), PW = hdr.indexOf('password');
const a = rows.slice(1).map(r => ({ name: (r[0] || '').trim(), user: (r[U] || '').trim(), pw: r[PW] })).find(x => x.name === who);
if (!a) { console.error('no such account in file'); process.exit(1); }
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto(H + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForSelector('input[autocomplete="current-password"], input[type=password]', { timeout: 200000 });
  await page.locator('input:not([type=password]):not([type=hidden]):not([type=checkbox])').first().fill(a.user);
  await page.locator('input[type=password]').first().fill(a.pw);
  await page.locator('form button[type=submit]').first().click();
  const ORG = process.env.ORG || 'NDC-Staging';
  for (let i = 0; i < 120; i++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => '');
    if (/invalid email or password/i.test(t)) break;
    if (/choose an organi[sz]ation|select an organi[sz]ation/i.test(t)) await page.getByRole('button', { name: ORG, exact: true }).click({ timeout: 5000 }).catch(() => page.locator('text="' + ORG + '"').first().click().catch(() => {}));
    if (!(await page.$('input[type=password]')) && !/signing in|choose an organi/i.test(t)) break; }
  await page.waitForTimeout(5000);
  const t = await page.innerText('body').catch(() => '');
  if (/Verify[\s\S]{0,80}recovery code/i.test(t)) { console.log('TWO_FACTOR_REQUIRED'); process.exitCode = 2; await b.close(); return; }
  if ((await page.$('input[type=password]')) || /invalid email/i.test(t)) { await page.screenshot({ path: out + '.fail.png' }); throw new Error('not signed in: ' + page.url()); }
  await ctx.storageState({ path: out }); console.log('signed in', app, page.url()); await b.close();
})().catch(e => { console.error('ERR', e.message.split('Call log:')[0]); process.exit(1); });
