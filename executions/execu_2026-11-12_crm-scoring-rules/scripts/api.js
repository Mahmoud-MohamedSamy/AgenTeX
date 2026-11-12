// node api.js <accountLabel> <script.js>
// Runs an API script as a TAVI Desk account without a browser. Signs in once, then reuses the refresh token kept in the
// scratchpad (never printed), so repeated runs don't sign the account in again. The script body gets api(method, path, body),
// sleep(ms), arr(x), fs, log(...).
const fs = require('fs'), path = require('path');
const P = path.resolve(__dirname, '../../..');
const SD = process.env.QA_TOKEN_DIR || path.join(require('os').tmpdir(), 'qa-tavi-tokens'); fs.mkdirSync(SD, { recursive: true });
const API = 'https://staging-' + (process.env.APP||'crm') + '.taviportal.com/api/v1';
const [label, file] = process.argv.slice(2);
const store = path.join(SD, 'tok-' + label.replace(/[^a-z0-9]/gi, '_') + (process.env.LANE ? '_' + process.env.LANE : '') + '.json'); // LANE=x gives a parallel lane its own token store
let tok = fs.existsSync(store) ? JSON.parse(fs.readFileSync(store, 'utf8')) : {};
const H = { 'content-type': 'application/json', 'x-app-key': (process.env.APP||'crm'), 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' };
async function login() {
  const rows = fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(','));
  const r = rows.find(x => x[0] === label); if (!r) throw new Error('no such label');
  const res = await fetch(API + '/iam/auth/login', { method: 'POST', headers: H, body: JSON.stringify({ email: r[1].trim(), password: r.slice(2).join(',').trim(), device_label: 'qa-automation', remember_me: true }) });
  if (res.status === 429) throw new Error('RATE_LIMITED');
  const j = await res.json(); if (!j.data || !j.data.access_token) throw new Error('sign-in failed ' + res.status);
  tok = { a: j.data.access_token, r: j.data.refresh_token, at: Date.now(), logins: (tok.logins || 0) + 1 };
}
async function refresh() {
  if (!tok.r) return login();
  const res = await fetch(API + '/iam/auth/refresh', { method: 'POST', headers: H, body: JSON.stringify({ refresh_token: tok.r }) });
  const j = await res.json().catch(() => ({}));
  if (res.status === 200 && j.success && j.data && j.data.access_token) tok = { ...tok, a: j.data.access_token, r: j.data.refresh_token || tok.r, at: Date.now() };
  else await login();
}
const ensure = async () => { if (!tok.a || Date.now() - (tok.at || 0) > 4 * 60000) await refresh(); fs.writeFileSync(store, JSON.stringify(tok)); };
const upload = async (p, filePath, name) => { await ensure(); const fd = new FormData(); fd.append('file', new Blob([fs.readFileSync(filePath)], {type:'text/csv'}), name); const r = await fetch(API + p, { method: 'POST', headers: { 'x-app-key': H['x-app-key'], 'x-tenant-id': H['x-tenant-id'], authorization: 'Bearer ' + tok.a }, body: fd }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 4000) }; };
const api = async (m, p, body) => {
  await ensure();
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(API + p, { method: m, headers: { ...H, authorization: 'Bearer ' + tok.a }, body: body !== undefined ? JSON.stringify(body) : undefined });
      const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { }
      if (r.status === 401 && i === 0) { await refresh(); continue; }
      return { s: r.status, j, t: t.slice(0, 4000) };
    } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 3000)); }
  }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
// Hides secrets in anything printed: token/secret/password-like keys (also inside JSON strings) and JWTs.
const redact = t => String(t).replace(/((?:token|secret|password|api_key)[A-Za-z_]*\\*"\s*:\s*\\*")[^"\\]+/gi, '$1<masked>').replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>');
const log = (...a) => console.log(redact(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')));
(async () => {
  const AF = Object.getPrototypeOf(async function () { }).constructor;
  const out = await new AF('api', 'sleep', 'arr', 'fs', 'log', 'upload', fs.readFileSync(file, 'utf8'))(api, sleep, arr, fs, log, upload);
  fs.writeFileSync(store, JSON.stringify(tok));
  if (out !== undefined) console.log(redact(JSON.stringify(out, null, 1)));
})().catch(e => { console.error('ERR', String(e.message).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>')); process.exit(1); });
