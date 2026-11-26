// node fx.js <script.js> [crm|desk]   API runner for the formula-fields run. Uses the saved owner session (scratchpad fx-o.json).
// On 401 it renews once (headless Edge, refresh cookie only) and saves the state back. Never prints tokens.
// Script body gets: api, sleep, fs, log, L (list), E (error text), led (ledger line), made (created ids, saved to made.json), keep().
const fs = require('fs'), path = require('path');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const RUN = P + '/executions/execu_2026-11-24_formula-matrix';
const S = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/ba925bc2-8d6e-462c-ad67-a1b38d88f7f1/scratchpad';
const ST = S + '/fx-' + (process.env.WHO || 'o') + '.json';
const [file, APP0] = process.argv.slice(2); let APP = APP0 || process.env.APP || 'crm';
const base = () => 'https://staging-' + APP + '.taviportal.com';
const TENANT = 'a7a7a7a7-0000-0000-0000-000000000004';
const tokOf = () => (JSON.parse(fs.readFileSync(ST, 'utf8')).cookies.find(c => c.name === 'aw_staging_access_token') || {}).value;
let tok = tokOf();
const red = s => String(s).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>');
async function renew() {
  const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
  const st = JSON.parse(fs.readFileSync(ST, 'utf8'));
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: { ...st, cookies: st.cookies.filter(c => c.name !== 'aw_staging_access_token') } });
  const pg = await ctx.newPage(); await pg.goto('https://staging-crm.taviportal.com/', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => { });
  let got = 0; for (let i = 0; i < 30 && !got; i++) { await pg.waitForTimeout(1000); got = (await ctx.cookies()).some(c => c.name === 'aw_staging_access_token'); }
  await pg.waitForTimeout(1500); if (got) await ctx.storageState({ path: ST }); await b.close();
  if (!got) throw new Error('SESSION LOST - owner must sign in again'); tok = tokOf();
}
const api = async (m, p, body, o = {}) => {
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(base() + '/api/v1' + p, { method: m, headers: { ...(o.form ? {} : { 'content-type': 'application/json' }), 'x-app-key': o.app || APP, 'x-tenant-id': TENANT, authorization: 'Bearer ' + tok }, body: o.form ? body : (body !== undefined ? JSON.stringify(body) : undefined) });
      const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { }
      if (r.status === 401 && i === 0) { await renew(); continue; }
      if (r.status === 429) throw new Error('429 rate limited - stop');
      return { s: r.status, j, t: t.slice(0, 4000) };
    } catch (e) { if (/429|SESSION/.test(e.message) || i === 5) throw e; await new Promise(r => setTimeout(r, 10000)); }
  }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(...a.map(x => red(typeof x === 'string' ? x : JSON.stringify(x))));
const L = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records || x.fields)) || [];
const E = r => r.s + (r.s >= 300 ? ' ' + (r.j?.error?.code || '') + ' ' + String(r.j?.error?.message || r.t).slice(0, 300) + (r.j?.error?.details ? ' ' + JSON.stringify(r.j.error.details).slice(0, 400) : '') : '');
const MADE = RUN + '/scripts/made' + (APP === 'desk' ? '-desk' : '') + '.json';
const made = (() => { try { return JSON.parse(fs.readFileSync(MADE, 'utf8')); } catch (e) { return {}; } })();
const keep = () => fs.writeFileSync(MADE, JSON.stringify(made, null, 1));
const led = m => fs.appendFileSync(RUN + '/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + 'Z ' + m + '\n');
const setApp = a => { APP = a; };
(async () => {
  const AF = Object.getPrototypeOf(async function () { }).constructor;
  const out = await new AF('api', 'sleep', 'fs', 'log', 'L', 'E', 'led', 'made', 'keep', 'setApp', 'RUN', (fs.existsSync(RUN + '/scripts/lib.js') ? fs.readFileSync(RUN + '/scripts/lib.js', 'utf8') + '\n' : '') + fs.readFileSync(file, 'utf8'))(api, sleep, fs, log, L, E, led, made, keep, setApp, RUN);
  if (out !== undefined) console.log(red(JSON.stringify(out, null, 1)));
})().catch(e => { console.error('ERR', red(e.message)); process.exit(1); });
