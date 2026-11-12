// Sign in as the owner and pick an organisation by name (ORG env). With ORG=list, print the org names offered and stop.
// Usage: CREDS=<creds.json> ORG=<name|list> node login-org.js <outStateFile>
const fs = require('fs'), path = require('path'); const P = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX';
const C = JSON.parse(fs.readFileSync(process.env.CREDS, 'utf8'))[process.env.WHO || 'tavi']; const ORG = process.env.ORG || 'list';
const H = process.env.HOST || 'https://staging-desk.taviportal.com';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch({ headless: process.env.HEADED ? false : true, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto(H + '/login', { waitUntil: 'commit', timeout: 90000 }); try { await page.waitForSelector('input[type=password]', { timeout: 480000 }); } catch (e) { await page.screenshot({ path: out + '.nologin.png' }); console.log('PAGE:', (await page.innerText('body').catch(()=>'')).replace(/s+/g,' ').slice(0,300), page.url()); throw e; }
  await page.fill('input[autocomplete~="username"], input[type=email]', C.user); await page.fill('input[type=password]', C.pw);
  await page.locator('form button[type=submit]').first().click();
  for (let i = 0; i < 90; i++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => '');
    if (/invalid email or password|too many/i.test(t)) { console.error('login refused'); process.exit(2); }
    if (/organi[sz]ation/i.test(t)) {
      if (ORG === 'list') { await page.screenshot({ path: out + '.orgs.png' }); console.log('PICKER:', t.replace(/\s+/g, ' ').slice(0, 600)); await b.close(); return; }
      await page.locator(`text=/^${ORG}$/`).first().click().catch(() => {}); }
    else if (!/sign in|signing in/i.test(t)) break; }
  await page.waitForTimeout(6000); const t = await page.innerText('body').catch(() => '');
  if (page.url().includes('/login')) { await page.screenshot({ path: out + '.fail.png' }); throw new Error('not signed in: ' + page.url()); }
  await ctx.storageState({ path: out }); console.log('signed in, URL', page.url()); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
