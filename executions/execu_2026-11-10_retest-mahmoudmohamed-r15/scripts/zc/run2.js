// Zoho CRM runner (org944965048), round 15. node run.js <stepFile.js> [args]. Step exports async ctx => {}.
// ctx = { page, context, shot(name, opts), api(method, path, body), gotoReady(url, re), log, args, RAW, OUT }. Prints no secrets.
const path = require('path'), fs = require('fs'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const RUN = path.join(P, 'executions/execu_2026-11-10_retest-mahmoudmohamed-r15'); const RAW = path.join(RUN, 'screenshots/raw'); const OUT = path.join(RUN, 'out');
const STATE = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/7bdc8a4e-b909-47ac-8ab1-e5eb1984afb7/scratchpad/state-zc2.json';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const [step, ...args] = process.argv.slice(2);
  const b = await chromium.launch({ headless: !!process.env.HL, channel: 'msedge', args: ['--disable-gpu'] });
  const context = await b.newContext({ storageState: STATE, viewport: { width: 1600, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0' });
  const page = await context.newPage();
  const shot = async (n, opts = {}) => { const f = path.join(RAW, `zoho-${n}.png`); await page.screenshot({ path: f, ...opts }); console.log('shot', path.basename(f)); };
  const api = async (method, p, body) => page.evaluate(async ({ method, p, body }) => {
    const m = document.cookie.match(/crmcsr=([^;]+)/); const tok = m ? m[1] : '';
    const r = await fetch(p, { method, headers: { 'Content-Type': 'application/json', 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + tok, 'X-CRM-ORG': '944965048' }, body: body ? JSON.stringify(body) : undefined, credentials: 'include' });
    const t = await r.text(); return { status: r.status, body: t };
  }, { method, p, body });
  const gotoReady = async (url, re, tries = 3) => {
    for (let k = 0; k < tries; k++) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      for (let s = 0; s < 45; s++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => ''); if (re.test(t)) { await page.waitForTimeout(1500); return true; } }
      console.log('reload', k);
    }
    throw new Error('not ready ' + url);
  };
  const log = (...a) => console.log(...a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).map(s => s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<email>')));
  try { await require(path.resolve(step))({ page, context, shot, api, gotoReady, log, args, RAW, OUT, RUN }); }
  catch (e) { console.error('ERR', String(e.message).split('Call log')[0]); await shot('err-' + Date.now()).catch(() => {}); }
  await context.storageState({ path: STATE }).catch(() => {});
  await b.close();
})();
