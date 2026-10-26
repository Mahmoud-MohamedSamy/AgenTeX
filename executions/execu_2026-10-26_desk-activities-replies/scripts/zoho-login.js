// Sign in to Zoho (read-only use) with row N of docs/Credentials/Zoho Desk Credentials.csv (header username,password). Prints no secret.
// Usage: node zoho-login.js <row 1-based> <outStateFile>
const path = require('path'), fs = require('fs'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const lines = fs.readFileSync(path.join(P, 'docs/Credentials/Zoho Desk Credentials.csv'), 'utf8').split(/\r?\n/).filter(Boolean).slice(1);
const [row, out] = process.argv.slice(2); const line = lines[Number(row) - 1]; const i = line.indexOf(','); const user = line.slice(0, i).trim(), pw = line.slice(i + 1).trim().replace(/^"|"$/g, '');
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0' });
  const page = await ctx.newPage();
  await page.goto('https://accounts.zoho.com/signin?servicename=ZohoSupport&serviceurl=https%3A%2F%2Fdesk.zoho.com%2Fagent', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.fill('#login_id', user); await page.click('#nextbtn'); await page.waitForSelector('#password', { state: 'visible', timeout: 30000 });
  await page.fill('#password', pw); await page.click('#nextbtn');
  for (let k = 0; k < 60; k++) { await page.waitForTimeout(1000); if (/desk\.zoho\.com/.test(page.url())) break; const t = await page.innerText('body').catch(() => ''); if (/incorrect password|verify|OTP|remind me later|skip/i.test(t)) { const s = page.locator('text=/Remind me later|Skip|I understand/i'); if (await s.count()) await s.first().click().catch(() => {}); } }
  await page.waitForTimeout(8000);
  console.log('user row', row, 'domain', user.split('@')[1], 'url', page.url().slice(0, 120));
  console.log((await page.innerText('body').catch(() => '')).slice(0, 400).replace(/\s+/g, ' '));
  await ctx.storageState({ path: out }); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
