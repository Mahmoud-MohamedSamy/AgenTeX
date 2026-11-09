// Sign in to TAVI Desk as the owner (org "Anyware") and save storage state. Creds from session scratchpad creds.json; nothing printed.
// Usage: node login-tavi.js <outStateFile>
const fs = require('fs'), path = require('path');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const C = JSON.parse(fs.readFileSync(process.env.CREDS, 'utf8')).tavi;
const H = 'https://staging-desk.taviportal.com';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto(H + '/', { waitUntil: 'commit', timeout: 90000 });
  await page.waitForSelector('input[type=password]', { timeout: 150000 });
  await page.fill('input[autocomplete~="username"], input[type=email]', C.user); await page.fill('input[type=password]', C.pw);
  await page.locator('form button[type=submit]').first().click();
  for (let i = 0; i < 90; i++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => '');
    if (/invalid email or password|too many/i.test(t)) { console.error('login refused'); process.exit(2); }
    if (/organi[sz]ation/i.test(t) && await page.$('text=Anyware')) { await page.locator('text=/^Anyware$/').first().click().catch(() => {}); }
    if (!/sign in|signing in|organi[sz]ation/i.test(t)) break; }
  await page.waitForTimeout(5000);
  const t = await page.innerText('body').catch(() => '');
  if (/sign in|signing in|invalid email/i.test(t)) { await page.screenshot({ path: out + '.fail.png' }); throw new Error('not signed in: ' + page.url()); }
  await ctx.storageState({ path: out }); console.log('signed in, URL', page.url()); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
