// node login-z18.js <row 1..3> <outState>  Sign in to Zoho with row N of "Zoho Credentials 14-11-2026.csv" (header username,password), headed Edge, once.
// Then probe CRM and Desk and print only the landing URLs (org ids). Prints no secret.
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const rows = fs.readFileSync(path.join(P, 'docs/Credentials/Zoho Credentials 14-11-2026.csv'), 'utf8').trim().split(/\r?\n/);
const hdr = rows[0].split(',').map(x => x.trim().toLowerCase()); const ui = hdr.indexOf('username'), pi = hdr.indexOf('password');
const n = +process.argv[2]; const cells = rows[n].split(','); const user = cells[ui].trim(); const pw = cells.slice(pi).join(',').trim();
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const out = process.argv[3]; const b = await chromium.launch({ headless: false, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  await page.goto('https://accounts.zoho.com/signin', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.fill('#login_id', user); await page.click('#nextbtn'); await page.waitForSelector('#password', { state: 'visible', timeout: 30000 });
  await page.fill('#password', pw); await page.click('#nextbtn');
  for (let k = 0; k < 60; k++) { await page.waitForTimeout(1000); const u = page.url();
    const t = await page.innerText('body').catch(() => ''); if (/incorrect password|invalid password/i.test(t)) { console.log('login refused'); await page.screenshot({path: out + '.refused.png'}); await b.close(); process.exit(2); }
    if (/verify|otp|one-time/i.test(t) && /code/i.test(t) && k > 5) { console.log('needs verification code'); break; }
    const s = page.locator('text=/Remind me later|Skip for now|I understand|Not now|Skip/i'); if (await s.count()) await s.first().click().catch(() => {});
    if (/accounts\.zoho\.com\/home|zoho\.com\/(crm|agent)|myaccount/.test(u)) break; }
  await ctx.storageState({ path: out });
  const res = {};
  for (const [k, u] of [['crm', 'https://crm.zoho.com/crm/'], ['desk', 'https://desk.zoho.com/agent/']]) {
    await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {}); await page.waitForTimeout(12000);
    const t = (await page.innerText('body').catch(() => '')).slice(0, 4000);
    res[k] = { url: page.url().replace(/[?#].*$/, '').slice(0, 90), signup: /sign ?up|get started|create (your|an) (org|portal)|trial/i.test(t) && !/home|leads|tickets/i.test(t.slice(0, 600)), title: (await page.title()).slice(0, 60) };
  }
  await ctx.storageState({ path: out }); await b.close(); console.log(JSON.stringify(res));
})().catch(e => { console.error('ERR', e.message.split('\n')[0]); process.exit(1); });
