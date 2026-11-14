// A6 browser runner (NDC-Staging Desk). Usage: node a6/ui.js <accountLabel> <script.js> [browser]
// Loads a saved session from automation/.auth; if the app asks for sign-in, signs in once through the form from the
// credentials CSV (never printed) and saves the session back. Script body gets: page, H, sleep, shot(name), text(), log(...), go(path), ctx, require.
const path = require('path'); const fs = require('fs');
const P = path.resolve(__dirname, '../../..');
const RAW = path.join(__dirname, 'evidence', 'ui'); fs.mkdirSync(RAW, { recursive: true });
const pw = require(path.join(P, 'node_modules/playwright-core'));
const H = 'https://staging-desk.taviportal.com';
const [who, file, br] = process.argv.slice(2);
const state = path.join(P, 'automation/.auth', `staging-desk.taviportal.com_${who}.json`);
(async () => {
  const kind = br === 'firefox' ? 'firefox' : 'chromium';
  const b = await pw[kind].launch({ headless: true, ...(kind === 'chromium' ? { channel: br === 'chrome' ? 'chrome' : 'msedge' } : {}) });
  const ctx = await b.newContext({ ...(fs.existsSync(state) ? { storageState: state } : {}), viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage(); page.setDefaultNavigationTimeout(150000); page.setDefaultTimeout(30000);
  const lines = []; const log = (...a) => lines.push(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
  const sleep = ms => page.waitForTimeout(ms);
  const shot = async (name, o = {}) => { await page.screenshot({ path: path.join(RAW, name.endsWith('.png') ? name : name + '.png'), ...o }); log('shot ' + name); };
  const text = () => page.innerText('body').catch(() => '');
  const signIn = async () => {
    const rows = fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(','));
    let em, pw; const r = rows.find(x => x[0] === who);
    if (r) { em = r[1].trim(); pw = r.slice(2).join(',').trim(); } else { const q = rows.find(x => x.map(s => s.trim()).includes(who)); if (!q) throw new Error('no such label'); const i = q.map(s => s.trim()).indexOf(who); em = who; pw = q[i + 1].trim(); }
    await page.locator('input[type=email], input[name=email]').first().fill(em);
    await page.locator('input[type=password]').first().fill(pw);
    await page.locator('button[type=submit]').first().click();
    await page.waitForURL(u => !/login|sign-in|auth/.test(u.pathname), { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000); log('signed in (form)');
  };
  const go = async p => {
    await page.goto(H + p, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(2500);
    await page.locator('input[type=password], nav, header').first().waitFor({ timeout: 20000 }).catch(() => {}); await page.waitForTimeout(1000);
    if (/login|sign-in|\/auth/.test(new URL(page.url()).pathname) || await page.locator('input[type=password]').count()) { await signIn(); await page.goto(H + p, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(2500); }
  };
  const fn = new Function('page', 'H', 'sleep', 'shot', 'text', 'log', 'go', 'ctx', 'require', `return (async () => { ${fs.readFileSync(path.resolve(__dirname, file), 'utf8')} })();`);
  let out; try { out = await fn(page, H, sleep, shot, text, log, go, ctx, require); } catch (e) { out = { SCRIPT_ERROR: String(e.stack || e).split('Call log:')[0].slice(0, 900) }; await page.screenshot({ path: path.join(RAW, 'ui-error.png') }).catch(() => {}); }
  await ctx.storageState({ path: state }).catch(() => {}); await b.close();
  console.log(JSON.stringify({ log: lines, out }, null, 1).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>'));
})().catch(e => { console.error('ERR', String(e.message).split('Call log:')[0]); process.exit(1); });
