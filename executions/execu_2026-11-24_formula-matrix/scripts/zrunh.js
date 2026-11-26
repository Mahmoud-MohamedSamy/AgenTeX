// node zrun.js <script.js>  Runs a script inside a Zoho CRM page (headless Edge, saved Zoho state, never written back). Script gets: page, zf(method, url, body) -> {s, j, t}, log, fs, RUN, sleep
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation'; const RUN = P + '/executions/execu_2026-11-24_formula-matrix';
const ST = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/ba925bc2-8d6e-462c-ad67-a1b38d88f7f1/scratchpad/zstate.json';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => { const b = await chromium.launch({ headless: !!process.env.HEADLESS, channel: 'msedge' }); const ctx = await b.newContext({ storageState: ST, viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  const log = (...a) => console.log(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')); const sleep = ms => page.waitForTimeout(ms);
  setTimeout(async () => { log('WATCHDOG'); await b.close().catch(() => {}); process.exit(3); }, +(process.env.WD || 900000)).unref();
  let CS = null, HN = null; page.on('request', r => { const h = r.headers(); if (!CS && h['x-zcsrf-token'] && r.url().includes('/crm/v')) { CS = h['x-zcsrf-token']; HN = Object.keys(h); } });
  await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads', { waitUntil: 'domcontentloaded', timeout: 120000 }); await sleep(6000);
  const zf = (m, u, body) => page.evaluate(async ([m, u, body, CS]) => {
    const r = await fetch(u, { method: m, headers: { 'X-ZCSRF-TOKEN': CS, 'Content-Type': 'application/json', 'X-CRM-ORG': '946877290' }, body: body ? JSON.stringify(body) : undefined, credentials: 'include' });
    const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { } return { s: r.status, j, t: t.slice(0, 3000) }; }, [m, u, body, CS]);
  log('csrf captured', !!CS, (HN || []).filter(h => /^x-/i.test(h)).join(',')); try { const AF = Object.getPrototypeOf(async function () { }).constructor; await new AF('page', 'zf', 'log', 'fs', 'RUN', 'sleep', fs.readFileSync(process.argv[2], 'utf8'))(page, zf, log, fs, RUN, sleep); }
  catch (e) { log('ERR', e.message.split('\n')[0]); await page.screenshot({ path: RUN + '/zoho/_err.png' }).catch(() => {}); }
  await b.close(); })();
