// node zrun.js <step.js>  — Edge, loads zstate.json read-only (never writes it back). Step gets page, shot(name), body(), sleep, log.
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => { const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: path.join(__dirname, 'zstate.json'), viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage(); page.setDefaultTimeout(30000);
  const shot = n => page.screenshot({ path: path.join(__dirname, 'shots', n + '.png') }); const sleep = ms => page.waitForTimeout(ms);
  const body = async (fr) => ((await (fr || page).locator('body').innerText().catch(() => '')) || '').replace(/\s+/g, ' ');
  const out = {}; try { const fn = new Function('page', 'shot', 'sleep', 'body', 'out', 'require', `return (async () => { ${fs.readFileSync(process.argv[2], 'utf8')} })();`); await fn(page, shot, sleep, body, out, require); } catch (e) { out.ERR = String(e.message).split('\n')[0]; await shot('err').catch(() => {}); }
  await b.close(); console.log(JSON.stringify(out, null, 1)); })();
