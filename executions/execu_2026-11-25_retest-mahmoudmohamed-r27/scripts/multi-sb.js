// node multi.js <script.js>
// Runs one script with several TAVI Desk accounts. as('<label>') returns api(method, path, body) for that account.
// Each account signs in once; refresh tokens are kept in the scratchpad token store (never printed).
// Script body gets: as, sleep, arr, fs, log, RUN, ledger, result, enc, dec, crypto.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const P = path.resolve(__dirname, '../../..');
const RUN = path.resolve(__dirname, '..');
const SD = process.env.QA_TOKEN_DIR || path.join(require('os').tmpdir(), 'qa-tavi-tokens'); fs.mkdirSync(SD, { recursive: true });
const API = 'https://staging-desk.taviportal.com/api/v1';
const H = { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': 'a8b4da7e-8445-4a95-8bd6-dbe5f5ea1bde' };
const file = process.argv[2];
const sessions = {};
function as(label) {
  if (sessions[label]) return sessions[label];
  const store = path.join(SD, 'tok-sb-' + label.replace(/[^a-z0-9]/gi, '_') + '.json');
  let tok = fs.existsSync(store) ? JSON.parse(fs.readFileSync(store, 'utf8')) : {};
  const save = () => fs.writeFileSync(store, JSON.stringify(tok));
  async function login() {
    const rows = fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(','));
    const r = rows.find(x => x[0] === label); if (!r) throw new Error('no such label ' + label);
    const res = await fetch(API + '/iam/auth/login', { method: 'POST', headers: H, body: JSON.stringify({ email: r[1].trim(), password: r.slice(2).join(',').trim(), device_label: 'qa-automation', remember_me: true }) });
    if (res.status === 429) throw new Error('RATE_LIMITED ' + label);
    const j = await res.json(); if (!j.data || !j.data.access_token) throw new Error('sign-in failed ' + label + ' ' + res.status);
    tok = { a: j.data.access_token, r: j.data.refresh_token, at: Date.now(), logins: (tok.logins || 0) + 1 }; save();
  }
  async function refresh() {
    if (!tok.r) return login();
    const res = await fetch(API + '/iam/auth/refresh', { method: 'POST', headers: H, body: JSON.stringify({ refresh_token: tok.r }) });
    const j = await res.json().catch(() => ({}));
    if (res.status === 200 && j.success && j.data && j.data.access_token) { tok = { ...tok, a: j.data.access_token, r: j.data.refresh_token || tok.r, at: Date.now() }; save(); }
    else await login();
  }
  const ensure = async () => { if (!tok.a || Date.now() - (tok.at || 0) > 4 * 60000) await refresh(); };
  const api = async (m, p, body, hdr) => {
    await ensure();
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(API + p, { method: m, headers: { ...H, authorization: "Bearer " + tok.a, ...(hdr || {}) }, body: body !== undefined ? JSON.stringify(body) : undefined });
        const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { }
        if (r.status === 401 && i === 0) { await refresh(); continue; }
        if (r.status === 429) throw new Error('RATE_LIMITED ' + label + ' ' + p);
        return { s: r.status, j, t: t.slice(0, 4000) };
      } catch (e) { if (/RATE_LIMITED/.test(e.message) || i === 2) throw e; await new Promise(r => setTimeout(r, 3000)); }
    }
  };
  return (sessions[label] = api);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
const redact = t => String(t).replace(/((?:token|secret|password|api_key)[A-Za-z_]*\\*"\s*:\s*\\*")[^"\\]+/gi, '$1<masked>').replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>');
const log = (...a) => console.log(redact(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')));
const stamp = () => new Date().toISOString().slice(0, 19);
const ledger = line => fs.appendFileSync(path.join(RUN, 'ledger.md'), `- ${stamp()} ${line}\n`);
const result = (id, verdict, note, extra) => { fs.appendFileSync(path.join(RUN, 'out/results.jsonl'), JSON.stringify({ id, verdict, note, at: stamp(), ...(extra || {}) }) + '\n'); };
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'string', value: String(v) };
const dec = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(dec) : v.kind === 'object' ? v.properties : v.value;
(async () => {
  const AF = Object.getPrototypeOf(async function () { }).constructor;
  const src = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8') + '\n' + fs.readFileSync(file, 'utf8');
  const out = await new AF('as', 'sleep', 'arr', 'fs', 'log', 'RUN', 'ledger', 'result', 'enc', 'dec', 'crypto', src)(as, sleep, arr, fs, log, RUN, ledger, result, enc, dec, crypto);
  if (out !== undefined) console.log(redact(JSON.stringify(out, null, 1)));
})().catch(e => { console.error('ERR', String(e.message).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>')); process.exit(1); });
