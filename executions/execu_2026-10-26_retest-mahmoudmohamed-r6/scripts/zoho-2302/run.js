// Generic runner: node run.js <stepFile.js> [args...]
// stepFile exports async (ctx) => {} where ctx = { page, context, shot(name), api(method, path, body), log, args }
const path = require('path'), fs = require('fs'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const D = path.join(P, 'executions/execu_2026-10-26_retest-mahmoudmohamed-r6');
const STATE = 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/3b03ac4f-1ce1-4a04-9337-4cb90e2010e4/scratchpad/zoho2302-state.json';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const [step, ...args] = process.argv.slice(2);
  const b = await chromium.launch({ headless: process.env.HEADED ? false : true, channel: 'msedge' });
  const context = await b.newContext({ storageState: STATE, viewport: { width: 1600, height: 900 }, acceptDownloads: true, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0' });
  const page = await context.newPage();
  const shot = async (n, opts = {}) => { const f = path.join(D, 'screenshots/raw', `zoho-2302-${n}.png`); await page.screenshot({ path: f, ...opts }); console.log('shot', f); };
  const api = async (method, p, body) => page.evaluate(async ({ method, p, body }) => {
    const m = document.cookie.match(/crmcsr=([^;]+)/); const tok = m ? m[1] : '';
    const r = await fetch(p, { method, headers: { 'Content-Type': 'application/json', 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + tok, 'X-CRM-ORG': '943261092' }, body: body ? JSON.stringify(body) : undefined, credentials: 'include' });
    const t = await r.text(); return { status: r.status, body: t.slice(0, 20000) };
  }, { method, p, body });
  const gotoReady = async (url, re, tries = 3) => {
    for (let k = 0; k < tries; k++) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      for (let s = 0; s < 40; s++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => ''); if (re.test(t)) { await page.waitForTimeout(1500); return true; } }
      console.log('reload', k);
    }
    throw new Error('not ready ' + url);
  };
  try { await require(path.resolve(step))({ page, context, shot, api, gotoReady, log: console.log, args, D }); }
  catch (e) { console.error('ERR', e.message); await shot('err-' + Date.now()).catch(() => {}); }
  await context.storageState({ path: STATE }).catch(() => {});
  await b.close();
})();
