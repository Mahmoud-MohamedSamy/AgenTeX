// Round 10 browser runner: loads one saved sign-in (o / u1 / u2 …), runs a page script, saves screenshots to screenshots/raw, saves the session back.
// Usage: node ui.js <who> <script.js>   The script body gets: page, H, T, sleep, shot(name, opts) → raw png, text() (body text), log(...)
// No secret is printed; the browser never sees a password (state file only).
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S = 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/3b03ac4f-1ce1-4a04-9337-4cb90e2010e4/scratchpad';
const RAW = path.join(__dirname, '..', 'screenshots', 'raw');
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const H = 'https://staging-desk.taviportal.com';
const [who, file] = process.argv.slice(2);
const state = `${S}/state-r10desk-${who}.json`;
const T = { LEADS: '259e93be-1e0a-4d78-a385-055db8265323', DEALS: 'f4961e76-16d4-4f9c-ab5c-6c98bf030711', TASKS: 'b581130f-b4c7-4a3b-90d3-7740c4b312c4', CONTACTS: '5e2f9234-435b-4a60-8582-5cd359b0d55e', LEADS_STD: '391ef6b6-6b95-4f5d-92e6-0f6e80c1941a' };
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: state, viewport: { width: 1600, height: 900 } }); const page = await ctx.newPage();
  const lines = []; const log = (...a) => lines.push(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
  const sleep = ms => page.waitForTimeout(ms);
  const shot = async (name, o = {}) => { await page.screenshot({ path: path.join(RAW, name), ...o }); log('shot ' + name); };
  const text = () => page.innerText('body').catch(() => '');
  const fn = new Function('page', 'H', 'T', 'sleep', 'shot', 'text', 'log', `return (async () => { ${(file === '-' ? process.env.CODE : fs.readFileSync(file, 'utf8'))} })();`);
  let out; try { out = await fn(page, H, T, sleep, shot, text, log); } catch (e) { out = { SCRIPT_ERROR: String(e.stack || e).split('Call log:')[0].slice(0, 900) }; await page.screenshot({ path: path.join(RAW, 'ui-error.png') }).catch(() => {}); }
  await ctx.storageState({ path: state }).catch(() => {}); await b.close();
  console.log(JSON.stringify({ log: lines, out }, null, 1).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>'));
})().catch(e => { console.error('ERR', String(e.message).split('Call log:')[0]); process.exit(1); });
