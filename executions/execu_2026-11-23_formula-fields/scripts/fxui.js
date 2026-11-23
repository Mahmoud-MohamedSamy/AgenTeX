// node fxui.js <script.js> [crm|desk]  Browser runner on the saved owner session (scratchpad fx-o.json); saves the session back after.
// Script gets: page, ctx, H, sleep, shot(name) -> screenshots/raw/<name>.png, text(sel), log, made, fs, RUN. Never prints tokens.
const path = require('path'), fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const RUN = P + '/executions/execu_2026-11-23_formula-fields';
const ST = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/ba925bc2-8d6e-462c-ad67-a1b38d88f7f1/scratchpad/fx-' + (process.env.WHO || 'o') + '.json';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const [file, app] = process.argv.slice(2); const H = 'https://staging-' + (app || 'crm') + '.taviportal.com';
const made = JSON.parse(fs.readFileSync(RUN + '/scripts/made' + (app === 'desk' ? '-desk' : '') + '.json', 'utf8'));
const red = s => String(s).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>');
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: ST, viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  page.setDefaultNavigationTimeout(150000); page.setDefaultTimeout(30000);
  const log = (...a) => console.log(red(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')));
  const sleep = ms => page.waitForTimeout(ms);
  const shot = async (n, o = {}) => { const p = path.join(RUN, 'screenshots/raw', n + '.png'); await page.screenshot({ path: p, ...o }); log('shot', n); return p; };
  const text = async (sel = 'body') => (await page.innerText(sel).catch(() => '')).replace(/[ \t]+/g, ' ');
  const save = async () => { const tmp = ST + ".tmp"; await ctx.storageState({ path: tmp }); const ok = JSON.parse(fs.readFileSync(tmp, "utf8")).cookies.some(c => c.name === "aw_staging_refresh_token"); if (ok) fs.renameSync(tmp, ST); else fs.unlinkSync(tmp); };
  setTimeout(async () => { log("WATCHDOG: 240 s, stopping"); await shot("_watchdog").catch(() => {}); await save().catch(() => {}); await b.close().catch(() => {}); process.exit(3); }, 240000).unref();
  try {
    const AF = Object.getPrototypeOf(async function () { }).constructor;
    await new AF('page', 'ctx', 'H', 'sleep', 'shot', 'text', 'log', 'made', 'fs', 'RUN', fs.readFileSync(file, 'utf8'))(page, ctx, H, sleep, shot, text, log, made, fs, RUN);
  } catch (e) { log('ERR', e.message.split('\n')[0]); await shot('_error').catch(() => { }); process.exitCode = 1; }
  const tmp = ST + '.tmp'; await ctx.storageState({ path: tmp });
  const ok = JSON.parse(fs.readFileSync(tmp, 'utf8')).cookies.some(c => c.name === 'aw_staging_refresh_token'); if (ok) fs.renameSync(tmp, ST); else fs.unlinkSync(tmp);
  await b.close();
})();
