// Headed Edge sign-in to NDC's Zoho Desk (read-only). Enters the email only, then waits up to 10 min for the user
// to approve the push / finish sign-in; writes status lines to <out>.log and saves storage state when Desk loads.
// Usage: node login-zoho-ndc.js <email> <outStateFile>
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const [email, out] = process.argv.slice(2); const log = m => fs.appendFileSync(out + '.log', new Date().toISOString().slice(11, 19) + ' ' + m + '\n');
(async () => {
  const b = await chromium.launch({ headless: false, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1500, height: 880 } }); const page = await ctx.newPage();
  await page.goto('https://accounts.zoho.com/signin?servicename=ZohoSupport&serviceurl=https%3A%2F%2Fdesk.zoho.com%2Fagent', { waitUntil: 'commit', timeout: 240000 });
  await page.waitForSelector('#login_id', { timeout: 240000 }); await page.fill('#login_id', email); await page.click('#nextbtn'); log('email entered');
  let last = '';
  for (let k = 0; k < 600; k++) { await page.waitForTimeout(1000);
    if (/desk\.zoho\.(com|eu|in)\/agent\//.test(page.url())) { log('DESK LOADED ' + page.url().slice(0, 100)); break; }
    const t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
    const state = /push notification|OneAuth|approve|notification to your|sent a .*request/i.test(t) ? 'PUSH' : (await page.locator('#password:visible').count()) ? 'PASSWORD' : /OTP|verification code/i.test(t) ? 'OTP' : /Remind me later|Skip for now|I understand|Not now/i.test(t) ? 'INTERSTITIAL' : 'OTHER';
    if (state === 'INTERSTITIAL') { await page.locator('text=/Remind me later|Skip for now|I understand|Not now/i').first().click().catch(() => {}); }
    if (state !== last) { last = state; log('STATE ' + state + ' :: ' + t.slice(0, 220)); await page.screenshot({ path: out + '.' + state + '.png' }).catch(() => {}); }
  }
  await page.waitForTimeout(12000); log('final url ' + page.url().slice(0, 120));
  await ctx.storageState({ path: out }); log('state saved'); await b.close();
})().catch(e => { log('ERR ' + e.message); process.exit(1); });
