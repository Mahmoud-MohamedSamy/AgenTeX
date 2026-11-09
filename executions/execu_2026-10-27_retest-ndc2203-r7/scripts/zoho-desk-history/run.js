// READ-ONLY Zoho Desk runner (Edge headless, 1280x720). node run.js <stepFile.js> [args...]
// Reuses the Zoho session saved in the scratchpad; prints no secrets.
const path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const D = path.join(P, 'executions/execu_2026-10-27_retest-ndc2203-r7');
const STATE = 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/3b03ac4f-1ce1-4a04-9337-4cb90e2010e4/scratchpad/zoho2302-state.json';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => {
  const [step, ...args] = process.argv.slice(2);
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await b.newContext({ storageState: STATE, viewport: { width: 1280, height: 720 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0' });
  const page = await context.newPage();
  const shot = async (n, opts = {}) => { const f = path.join(D, 'screenshots/raw', `zoho-desk-history-${n}.png`); await page.screenshot({ path: f, ...opts }); console.log('shot', f); };
  try { await require(path.resolve(step))({ page, context, shot, log: console.log, args }); }
  catch (e) { console.error('ERR', e.message.slice(0, 1500)); }
  await context.storageState({ path: STATE }).catch(() => {});
  await b.close();
})();
