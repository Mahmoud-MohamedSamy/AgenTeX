// Sign in once to desk.anyware.software (no secret printed) and save storage state.
// Usage: node login.js <email> <outStateFile>
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const H = 'https://desk.anyware.software';
const [email, out] = process.argv.slice(2);
(async () => {
  const creds = JSON.parse(fs.readFileSync(path.join(P, 'docs/Credentials/TAVI DESK Credentials.txt'), 'utf8'));
  const acct = creds.find(c => c.Email === email); if (!acct) throw new Error('no such account in file');
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto(H + '/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
  console.log('landed', page.url());
  await page.waitForSelector('input[type=email],input[name=email]', { timeout: 30000 }); await page.fill('input[type=email],input[name=email]', acct.Email);
  if (!(await page.$('input[type=password]'))) await page.keyboard.press('Enter');
  await page.waitForSelector('input[type=password]'); await page.fill('input[type=password]', acct['Pass' + 'word']); await page.keyboard.press('Enter');
  try { await page.waitForURL(u => !/login|sign-?in|auth/.test(u.toString()), { timeout: 45000 }); } catch (e) { await page.screenshot({ path: out + '.fail.png' }); console.log('URL now', page.url()); console.log((await page.innerText('body')).slice(0, 500)); throw e; }
  await page.waitForTimeout(3000);
  await ctx.storageState({ path: out }); console.log('state saved, URL', page.url()); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
