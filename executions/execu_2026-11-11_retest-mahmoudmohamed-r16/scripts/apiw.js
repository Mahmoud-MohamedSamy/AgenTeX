// node apiw.js <who> <script.js|->   API runner that borrows the browser session (scratchpad r16-<who>.json) — no extra sign-in.
// Uses the access-token cookie as Bearer; on 401 opens the saved session headless so the app refreshes it, saves it, retries.
// Script body gets api(method, path, body), sleep, arr, fs, log. Never prints tokens.
const fs = require('fs'), path = require('path');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/7bdc8a4e-b909-47ac-8ab1-e5eb1984afb7/scratchpad';
const APP = process.env.APP || 'desk'; const BASE = 'https://staging-' + APP + '.taviportal.com';
const [who, file] = process.argv.slice(2); const state = `${S}/r16-${who}.json`;
const H = { 'content-type': 'application/json', 'x-app-key': APP, 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' };
const tokOf = () => (JSON.parse(fs.readFileSync(state, 'utf8')).cookies.find(c => c.name === 'aw_staging_access_token') || {}).value;
let tok = tokOf();
async function renew() {
  const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const ctx = await b.newContext({ storageState: state });
  const pg = await ctx.newPage(); await pg.goto(BASE + '/hq', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});
  await pg.waitForTimeout(8000); await ctx.storageState({ path: state }); await b.close(); tok = tokOf();
}
const api = async (m, p, body) => {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(BASE + '/api/v1' + p, { method: m, headers: { ...H, authorization: 'Bearer ' + tok }, body: body !== undefined ? JSON.stringify(body) : undefined });
      const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { }
      if (r.status === 401 && i === 0) { await renew(); continue; }
      return { s: r.status, j, t: t.slice(0, 4000) };
    } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 3000)); }
  }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
const log = (...a) => console.log(...a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).map(s => s.replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>')));
(async () => {
  const AF = Object.getPrototypeOf(async function () { }).constructor;
  const out = await new AF('api', 'sleep', 'arr', 'fs', 'log', file === '-' ? process.env.CODE : fs.readFileSync(file, 'utf8'))(api, sleep, arr, fs, log);
  if (out !== undefined) console.log(JSON.stringify(out, null, 1).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>'));
})().catch(e => { console.error('ERR', String(e.message).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>')); process.exit(1); });
