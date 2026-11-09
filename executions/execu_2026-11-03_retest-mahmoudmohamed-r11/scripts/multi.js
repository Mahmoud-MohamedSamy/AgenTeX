// Round 10 (Anyware tenant): runs one API script with several saved sign-ins at once — no new sign-in, tokens never printed.
// Usage: node multi.js <script.js> [who=stateFile ...]   (default: o, u1, u2, u3, u4 from the scratchpad state-r11<who>.json when present)
// The script body gets: api(who, method, path, body) → {s, j, t}, sleep, arr, rec(fields) (record data array), T (tenant ids), log(...), ledger(line)
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S = 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/3b03ac4f-1ce1-4a04-9337-4cb90e2010e4/scratchpad';
const RUN = path.join(__dirname, '..');
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const H = 'https://staging-crm.taviportal.com'; const API = H + '/api/v1';
const [file, ...pairs] = process.argv.slice(2);
const states = {}; for (const w of ['o', 'u1', 'u2', 'u3', 'u4']) { const f = `${S}/state-r11${w === 'o' ? 'owner' : w}.json`; if (fs.existsSync(f)) states[w] = f; }
for (const p of pairs) { const [k, v] = p.split('='); states[k] = v; }
// Anyware tenant facts (baseline read 29 Oct 2026, see ../baseline-anyware.json)
const T = {
  LEADS: '259e93be-1e0a-4d78-a385-055db8265323', CONTACTS: '5e2f9234-435b-4a60-8582-5cd359b0d55e', DEALS: 'f4961e76-16d4-4f9c-ab5c-6c98bf030711',
  TASKS: 'b581130f-b4c7-4a3b-90d3-7740c4b312c4', LEADS_STD: '391ef6b6-6b95-4f5d-92e6-0f6e80c1941a',
  OWNER: '7017d261-36ee-4e2f-9e60-2310ece52ef8', U1: '3a503b61-076b-4d75-8d44-77071f3b7c39', U2: '0b3fefb6-acd0-4a8f-abb9-aa7fc04087e2',
  U3: '60963775-a57c-46ac-877a-2dbfa20e98d7', U4: '142e42d2-cb51-4e95-90d1-c53c0e9f508f',
  OU_TEAM1: '93e12184-f2e9-4d39-be05-4979dcc7f6ce', OU_TEAM2: 'c0bbef4b-aa31-445b-a7da-3c8a591466b0', OU_AGENTX: '0ca1e5ab-c592-4b1b-97f8-d46042bdca10', OU_AGENTZ: '91882395-7e99-4b61-8377-3a3460d225ae', OU_ORG: '885c229c-4680-c640-b493-9c70a74f88a1',
  P_ADMIN: '11111111-1111-1111-1111-111111111105', P_MANAGER: '11111111-1111-1111-1111-111111111102', P_SUPERVISOR: '11111111-1111-1111-1111-111111111104', P_USER: '11111111-1111-1111-1111-111111111103', P_DESKADMIN: '44444444-4444-4444-4444-444444444401',
};
const red = s => String(s).replace(/Bearer\s+\S+/g, 'Bearer <redacted>').replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>').replace(/(aw_[a-z_]*token)=[^;\s]+/gi, '$1=<redacted>');
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const ctx = {};
  for (const [w, f] of Object.entries(states)) {
    const c = await b.newContext({ storageState: f }); const pg = await c.newPage();
    // A page load lets the app refresh the access cookie if it expired.
    await pg.goto((process.env.HOMEH || H) + '/', { waitUntil: 'commit', timeout: 120000 }).catch(() => {}); for (let i = 0; i < 40; i++) { await pg.waitForTimeout(3000); if ((await c.cookies()).some(x => x.name === 'aw_staging_access_token')) break; } ctx[w] = { c, pg, f };
  }
  const tok = w => ctx[w].c.cookies().then(c => (c.find(x => x.name === 'aw_staging_access_token') || {}).value);
  const api = async (w, m, p, body) => {
    if (!ctx[w]) throw new Error('no session ' + w); const t = await tok(w); if (!t) throw new Error('SIGNED_OUT ' + w);
    for (let i = 0; i < 3; i++) {
      const dk = p.startsWith('desk:'); const pp = dk ? p.slice(5) : p;
      const r = await ctx[w].c.request.fetch((pp.startsWith('http') ? '' : dk ? 'https://staging-desk.taviportal.com/api/v1' : API) + pp, { method: m, headers: { authorization: 'Bearer ' + t, 'x-app-key': dk ? 'desk' : 'crm', ...(body !== undefined ? { 'content-type': 'application/json' } : {}) }, data: body !== undefined ? JSON.stringify(body) : undefined, failOnStatusCode: false, timeout: 120000 }).catch(e => ({ status: () => 'ERR', text: async () => String(e.message).slice(0, 200) }));
      const x = await r.text(); let j = null; try { j = JSON.parse(x); } catch (e) { }
      if ((r.status() === 502 || r.status() === 503 || r.status() === 504 || (r.status() === 'ERR' && /ENOTFOUND|ECONNRESET|ETIMEDOUT/.test(x))) && i < 2) { await new Promise(s => setTimeout(s, 6000)); continue; }
      return { s: r.status(), j, t: x.slice(0, 3000) };
    }
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
  const fv = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : { kind: 'string', value: String(v) };
  const rec = f => Object.entries(f).map(([k, v]) => ({ field: k, value: fv(v) }));
  const lines = []; const log = (...a) => { const l = a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '); lines.push(l); };
  const ledger = l => fs.appendFileSync(path.join(RUN, 'ledger.md'), `- ${new Date().toISOString().slice(0, 19)} ${l}\n`);
  const X = require('./procs-r11.js')({ api, T, sleep, arr, ledger });   // process builders + run-time helpers
  const fn = new Function('api', 'sleep', 'arr', 'rec', 'T', 'log', 'ledger', 'ctx', 'H', 'X', `return (async () => { ${(file === '-' ? process.env.CODE : fs.readFileSync(file, 'utf8'))} })();`);
  let out; try { out = await fn(api, sleep, arr, rec, T, log, ledger, ctx, H, X); } catch (e) { out = { SCRIPT_ERROR: String(e.stack || e).slice(0, 1200) }; }
  for (const w of Object.keys(ctx)) { await ctx[w].c.storageState({ path: ctx[w].f }).catch(() => {}); }
  await b.close();
  console.log(red(JSON.stringify({ log: lines, out }, null, 1)));
})().catch(e => { console.error('ERR', red(String(e.message).split('Call log:')[0])); process.exit(1); });
