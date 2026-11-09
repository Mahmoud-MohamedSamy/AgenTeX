// Runs an API-only script without the shared playwright-cli session (it crashed repeatedly on 18 Oct).
// Usage: node apirun.js <stateFile> <script.js>   — the script body gets: api(method, path, body), sleep(ms), arr(x), done(obj)
// Tokens are never printed.
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const H = 'https://staging-crm.taviportal.com'; const API = H + '/api/v1';
const [state, file] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: state }); const page = await ctx.newPage();
  // A page load lets the app refresh the access cookie if it expired.
  await page.goto(H + '/', { waitUntil: 'commit', timeout: 120000 }); await page.waitForTimeout(6000);
  const tok = () => ctx.cookies().then(c => (c.find(x => x.name === 'aw_staging_access_token') || {}).value);
  const api = async (m, p, body) => { const t = await tok(); if (!t) throw new Error('SIGNED_OUT');
    const r = await ctx.request.fetch(API + p, { method: m, headers: { authorization: 'Bearer ' + t, 'x-app-key': 'crm', ...(body !== undefined ? { 'content-type': 'application/json' } : {}) }, data: body !== undefined ? JSON.stringify(body) : undefined, failOnStatusCode: false });
    const x = await r.text(); let j = null; try { j = JSON.parse(x); } catch (e) { } return { s: r.status(), j, t: x.slice(0, 3000) }; };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
  const fn = new Function('api', 'sleep', 'arr', 'page', 'H', `return (async () => { ${fs.readFileSync(file, 'utf8')} })();`);
  const out = await fn(api, sleep, arr, page, H);
  await ctx.storageState({ path: state }); await b.close();
  console.log(JSON.stringify(out, null, 1).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>'));
})().catch(e => { console.error('ERR', String(e.message).split('Call log:')[0].replace(/Bearer\s+\S+/g, 'Bearer <redacted>').replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>').replace(/(aw_[a-z_]*token)=[^;\s]+/gi, '$1=<redacted>')); process.exit(1); });
