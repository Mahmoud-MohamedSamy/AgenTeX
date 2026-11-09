// node login.js <label> <outState>  — reads docs/Credentials/TAVI Desk Credentials.csv (name,username,password). Prints no secret.
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const H = 'https://staging-desk.taviportal.com';
const rows = fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(','));
const [label, out] = process.argv.slice(2);
const r = rows.find(x => x[0] === label); if (!r) { console.error('no such label'); process.exit(1); }
const a = { user: r[1], pw: r.slice(2).join(',') };
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto(H + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('input[autocomplete="current-password"]', { timeout: 170000 });
  await page.locator('input:not([type=password]):not([type=hidden])').first().fill(a.user); await page.fill('input[autocomplete="current-password"]', a.pw);
  await page.locator('form button[type=submit]').first().click();
  for (let i = 0; i < 90; i++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => '');
    if (/invalid email or password/i.test(t)) break;
    if (await page.$('text=NDC-Staging') && /organi[sz]ation/i.test(t)) await page.click('text=NDC-Staging').catch(() => {});
    if (!(await page.$('input[autocomplete="current-password"]'))) break; }
  await page.waitForTimeout(5000);
  const t = await page.innerText('body').catch(() => '');
  if (/recovery code|two-factor|verification code/i.test(t)) { console.log('TWO_FACTOR_REQUIRED'); await b.close(); process.exit(2); }
  if ((await page.$('input[autocomplete="current-password"]')) || /invalid email/i.test(t)) { console.log('LOGIN_FAILED'); await b.close(); process.exit(1); }
  await ctx.storageState({ path: out }); console.log('signed in, URL', page.url()); await b.close();
})().catch(e => { console.error('ERR', String(e.message).slice(0, 200)); process.exit(1); });
