// Screen helper for A4 screen rows. node ui.js <step-file.js> [account]
// Signs in once per account (session saved next to this file), then runs the step file with {page, ctx, shot, txt, go, log}.
// Never prints credentials.
const fs = require('fs'), path = require('path');
const { chromium } = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright');
const BASE = 'https://staging-desk.taviportal.com';
const CSV = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/docs/Credentials/TAVI Desk Credentials.csv';
const [step, acct = 'ndc-staging-owner'] = process.argv.slice(2);
const STATE = path.join(__dirname, 'state-' + acct.replace(/\W/g, '_') + '.json');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const B = process.env.BR || 'chromium'; const pw = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright'); const browser = await pw[B === 'firefox' ? 'firefox' : 'chromium'].launch({ headless: true });
  const opts = { viewport: { width: 1440, height: 900 }, locale: 'en-US' };
  let ctx = await browser.newContext(fs.existsSync(STATE) ? { ...opts, storageState: STATE } : opts);
  let page = await ctx.newPage();
  const go = async (p) => { for (let i = 0; ; i++) { try { await page.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 60000 }); if (/Bad Gateway|Gateway Time/i.test(await page.title())) throw new Error('gateway'); break; } catch (e) { if (i >= 3) throw e; await page.waitForTimeout(20000); } } await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {}); };
  await go('/settings/automation/workflow-rules');
  if (/login|sign-?in/i.test(page.url()) || await page.locator('input[type=password]').count()) {
    const row = fs.readFileSync(CSV, 'utf8').split(/\r?\n/).slice(1).map(l => l.split(',')).find(x => x[0] === acct);
    if (!row) throw new Error('no such account label');
    await page.locator('input[type=email], input[name=email], input[name=username], input[type=text]').first().fill(row[1]); await page.waitForTimeout(300);
    await page.locator('input[type=password]').first().fill(row[2]);
    await page.locator('button[type=submit], button:has-text("Sign in"), button:has-text("Log in")').first().click();
    await page.locator('input[type=password]').first().waitFor({ state: 'detached', timeout: 60000 }); await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {}); console.log('after sign-in url', page.url().split('?')[0]);
    await ctx.storageState({ path: STATE });
    console.log('signed in once as', acct);
    await go('/settings/automation/workflow-rules');
  }
  const shot = async (name, o = {}) => { const f = path.join(OUT, name + '.png'); await page.screenshot({ path: f, fullPage: !!o.full }); return f; };
  const txt = async (sel = 'main', n = 1500) => (await page.locator(sel).first().innerText().catch(() => '')).replace(/\n{2,}/g, '\n').slice(0, n);
  const R = {}; const log = (k, v) => { R[k] = v; };
  try { await require(path.resolve(step))({ page, ctx, browser, go, shot, txt, log, BASE }); }
  catch (e) { R.ERROR = String(e && e.message || e).slice(0, 500); await shot('error-' + path.basename(step, '.js')).catch(() => {}); }
  await ctx.storageState({ path: STATE }).catch(() => {});
  console.log(JSON.stringify(R, null, 1));
  await browser.close();
})();
