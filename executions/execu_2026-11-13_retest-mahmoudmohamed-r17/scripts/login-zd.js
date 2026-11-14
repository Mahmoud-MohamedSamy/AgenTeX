// Sign in to Zoho Desk (techsolutionsegypt) once, headed Edge, save storage state. User from env ZUSER, password = row 1 column "password" of Zoho Desk Credentials.csv. Prints no secret.
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const rows = fs.readFileSync(path.join(P, 'docs/Credentials/Zoho Desk Credentials.csv'), 'utf8').split(/\r?\n/).filter(Boolean);
const hdr = rows[0].split(',').map(x => x.trim().toLowerCase()); const pi = hdr.indexOf('password'); const cells = rows[1].split(','); const pw = cells.slice(pi).join(',').trim();
const user = process.env.ZUSER; if (!user) { console.error('set ZUSER'); process.exit(1); }
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const out = process.argv[2]; const b = await chromium.launch({ headless: false, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto('https://accounts.zoho.com/signin?servicename=ZohoSupport&serviceurl=https%3A%2F%2Fdesk.zoho.com%2Fagent', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.fill('#login_id', user); await page.click('#nextbtn'); await page.waitForSelector('#password', { state: 'visible', timeout: 30000 });
  await page.fill('#password', pw); await page.click('#nextbtn');
  for (let k = 0; k < 90; k++) { await page.waitForTimeout(1000); if (/desk\.zoho\.com\/agent\//.test(page.url())) break;
    const t = await page.innerText('body').catch(() => ''); if (/incorrect password|invalid/i.test(t)) { console.error('login refused'); process.exit(2); }
    const s = page.locator('text=/Remind me later|Skip for now|I understand|Not now/i'); if (await s.count()) await s.first().click().catch(() => {}); }
  await page.waitForTimeout(8000); console.log('url', page.url().slice(0, 100));
  await ctx.storageState({ path: out }); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
