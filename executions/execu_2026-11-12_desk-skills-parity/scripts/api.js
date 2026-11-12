// node api.js <label> <script.js|->  Desk API runner: signs <label> in ONCE (token pair kept in scratchpad), refreshes after.
// Script body gets api(method, path, body), sleep, arr, fs, log, track(kind,id,name). Never prints tokens or credentials.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const S = process.env.SCRATCH || 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad';
const BASE = 'https://staging-desk.taviportal.com/api/v1';
const H = { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' };
const [label, file] = process.argv.slice(2);
const tf = `${S}/sk12-tok-${label.replace(/\W+/g, '_')}.json`;
const LEDGER = path.resolve(__dirname, '../ledger.md');
let T = fs.existsSync(tf) ? JSON.parse(fs.readFileSync(tf, 'utf8')) : null;
function creds() {
  const lines = fs.readFileSync(path.join(ROOT, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/).slice(1);
  for (const l of lines) { const p = l.split(','); if (p.length >= 3 && p[0].trim() === label) return [p[1].trim(), p.slice(2).join(',').trim()]; }
  throw new Error('no account labelled ' + label);
}
async function login() {
  const [email, password] = creds();
  const r = await fetch(BASE + '/iam/auth/login', { method: 'POST', headers: H, body: JSON.stringify({ email, password, device_label: 'qa-sk12', remember_me: true }) });
  if (r.status === 429) { console.error('STOP: 429 on sign-in'); process.exit(2); }
  const j = await r.json(); if (r.status !== 200) throw new Error('sign-in failed ' + r.status);
  T = { a: j.data.access_token, r: j.data.refresh_token, at: Date.now() }; fs.writeFileSync(tf, JSON.stringify(T)); console.error('[signed in ' + label + ']');
}
async function refresh() {
  const r = await fetch(BASE + '/iam/auth/refresh', { method: 'POST', headers: H, body: JSON.stringify({ refresh_token: T.r }) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 200 && j.success) { T = { a: j.data.access_token, r: j.data.refresh_token || T.r, at: Date.now() }; fs.writeFileSync(tf, JSON.stringify(T)); return true; }
  return false;
}
async function tok() { if (!T) await login(); else if (Date.now() - T.at > 4 * 60000 && !(await refresh())) await login(); return T.a; }
const api = async (m, p, body) => {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(BASE + p, { method: m, headers: { ...H, authorization: 'Bearer ' + await tok() }, body: body !== undefined ? JSON.stringify(body) : undefined });
      if (r.status === 429) { console.error('STOP: 429'); process.exit(2); }
      if (r.status === 401 && i === 0) { if (!(await refresh())) await login(); continue; }
      if (r.status >= 502 && r.status <= 504) { await sleep(3000 * (i + 1)); continue; }
      const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { }
      return { s: r.status, j, t: t.slice(0, 3000) };
    } catch (e) { if (i === 3) throw e; await sleep(3000); }
  }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
const clean = s => s.replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>');
const log = (...a) => console.log(clean(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')));
const track = (kind, id, name) => fs.appendFileSync(LEDGER, `- ${new Date().toISOString().slice(0, 16)} TAVI ${kind} ${name} ${id}\n`);
(async () => {
  const AF = Object.getPrototypeOf(async function () { }).constructor;
  const out = await new AF('api', 'sleep', 'arr', 'fs', 'log', 'track', file === '-' ? process.env.CODE : fs.readFileSync(file, 'utf8'))(api, sleep, arr, fs, log, track);
  if (out !== undefined) console.log(clean(JSON.stringify(out, null, 1)));
})().catch(e => { console.error('ERR', clean(String(e.message))); process.exit(1); });
