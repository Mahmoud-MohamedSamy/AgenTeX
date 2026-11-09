// Sign in to Zoho Desk (read-only reference) with the zoho entry of the session creds file; prints no secret.
// Usage: CREDS=<creds.json> node login-zoho.js <outStateFile>
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const C = JSON.parse(fs.readFileSync(process.env.CREDS, 'utf8')).zoho; if (process.env.ZUSER) C.user = process.env.ZUSER;
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch({ headless: false, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto('https://accounts.zoho.com/signin?servicename=ZohoSupport&serviceurl=https%3A%2F%2Fdesk.zoho.com%2Fagent', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.fill('#login_id', C.user); await page.click('#nextbtn'); await page.waitForSelector('#password', { state: 'visible', timeout: 30000 });
  await page.fill('#password', C.pw); await page.click('#nextbtn');
  for (let k = 0; k < 90; k++) { await page.waitForTimeout(1000); if (/desk\.zoho\.com\/agent\//.test(page.url())) break;
    const t = await page.innerText('body').catch(() => ''); if (/incorrect password|invalid|cannot find|doesn.t exist/i.test(t)) { await page.screenshot({ path: out + '.fail.png' }); console.error('login refused: ' + (t.match(/.{0,60}(incorrect password|invalid|cannot find|doesn.t exist).{0,60}/i)||[''])[0]); process.exit(2); }
    const s = page.locator('text=/Remind me later|Skip for now|I understand|Not now/i'); if (await s.count()) await s.first().click().catch(() => {}); }
  await page.waitForTimeout(10000);
  console.log('url', page.url().slice(0, 140)); console.log((await page.innerText('body').catch(() => '')).slice(0, 300).replace(/\s+/g, ' '));
  await ctx.storageState({ path: out }); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
