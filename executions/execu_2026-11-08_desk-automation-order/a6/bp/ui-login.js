// Sign in once to TAVI Desk staging as the tenant owner and save storage state. Secrets come from env, never printed.
// env: TU (email), TP (password). Usage: node login.js <outStateFile>
const P = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX';
const H = 'https://staging-desk.taviportal.com';
const { chromium } = require(P + '/node_modules/playwright-core');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch({ headless: true, channel: process.env.CH || 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto(H + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('input[type=password]', { timeout: 60000 });
  await page.fill('input[autocomplete~="username"], input[type=email]', process.env.TU);
  await page.fill('input[type=password]', process.env.TP);
  await page.locator('form button[type=submit]').first().click();
  let t = '';
  for (let i = 0; i < 90; i++) { await page.waitForTimeout(1000); t = await page.innerText('body').catch(() => '');
    if (/invalid email or password|session limit/i.test(t)) break;
    if (/Choose an organization/i.test(t)) { await page.getByRole('button', { name: /^Anyware$/ }).or(page.getByText('Anyware', { exact: true })).first().click().catch(e => console.log('org click', e.message)); await page.waitForTimeout(3000); continue; }
    if (!/sign in|signing in/i.test(t)) break; }
  await page.waitForTimeout(5000); t = await page.innerText('body').catch(() => '');
  await page.screenshot({ path: out + '.png' });
  if (/sign in|signing in|invalid email|session limit/i.test(t)) { console.log('FAIL', page.url(), t.slice(0, 300).replace(/\s+/g, ' ')); process.exit(1); }
  await ctx.storageState({ path: out }); console.log('signed in, URL', page.url()); await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
