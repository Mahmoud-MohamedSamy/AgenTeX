// node api.js <accountLabel> <script.js>
// Runs an API script as a TAVI Desk account without a browser. Signs in once, then reuses the refresh token kept in the
// scratchpad (never printed), so repeated runs don't sign the account in again. The script body gets api(method, path, body),
// sleep(ms), arr(x), fs, log(...).
const fs = require('fs'), path = require('path');
const P = path.resolve(__dirname, '../../..');
const SD = process.env.QA_TOKEN_DIR || path.join(require('os').tmpdir(), 'qa-tavi-tokens'); fs.mkdirSync(SD, { recursive: true });
const APP = process.env.APP || 'desk'; const API = 'https://staging-' + APP + '.taviportal.com/api/v1';
const [label, file] = process.argv.slice(2);
const store = path.join(SD, 'tok-' + label.replace(/[^a-z0-9]/gi, '_') + (process.env.LANE ? '_' + process.env.LANE : '') + '.json'); // LANE=x gives a parallel lane its own token store
let tok = fs.existsSync(store) ? JSON.parse(fs.readFileSync(store, 'utf8')) : {};
const H = { 'content-type': 'application/json', 'x-app-key': APP, 'x-tenant-id': process.env.TENANT || 'a7a7a7a7-0000-0000-0000-000000000004' };
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
// Streams a Tia turn: returns {status, text, final, error, firstMs, totalMs, progress}
const stream = async (p, body, timeoutMs = 120000) => {
  await ensure();
  const t0 = Date.now(); let firstMs = null; const events = []; let text = ''; let final = null; let error = null;
  const ac = new AbortController(); const to = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(API + p, { method: 'POST', headers: { ...H, accept: 'text/event-stream', authorization: 'Bearer ' + tok.a }, body: JSON.stringify(body), signal: ac.signal });
    const ct = r.headers.get('content-type') || '';
    if (!ct.includes('event-stream')) { const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { status: r.status, notStream: true, j, t: t.slice(0, 1500), totalMs: Date.now() - t0 }; }
    const rd = r.body.getReader(); const dec = new TextDecoder(); let buf = '';
    for (;;) { const { done, value } = await rd.read(); if (done) break; buf += dec.decode(value, { stream: true }).replace(/\r\n?/g, '\n');
      let i; while ((i = buf.indexOf('\n\n')) >= 0) { const blk = buf.slice(0, i); buf = buf.slice(i + 2);
        const data = blk.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trimStart()).join('\n'); if (!data) continue;
        let e; try { e = JSON.parse(data); } catch (x) { e = { raw: data }; } events.push(e);
        if (e.type === 'delta') { if (firstMs === null) firstMs = Date.now() - t0; text += e.text || ''; } else if (e.type === 'discard') text = ''; else if (e.type === 'final') { final = e.response; } else if (e.type === 'error') error = e.code || 'ERR'; }
      if (final || error) break; }
    try { ac.abort(); } catch (x) {}
    return { status: r.status, types: [...new Set(events.map(e => e.type || 'raw'))], progress: events.filter(e => e.type === 'progress').map(e => e.label).filter(Boolean), text, final, error, firstMs, totalMs: Date.now() - t0, raw0: events[0] && events[0].raw ? String(events[0].raw).slice(0, 300) : undefined };
  } catch (e) { return { status: 0, error: 'CLIENT_' + e.name, totalMs: Date.now() - t0, partial: text.slice(0, 300), types: [...new Set(events.map(e => e.type || 'raw'))] }; } finally { clearTimeout(to); }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
// Hides secrets in anything printed: token/secret/password-like keys (also inside JSON strings) and JWTs.
const redact = t => String(t).replace(/((?:token|secret|password|api_key)[A-Za-z_]*\\*"\s*:\s*\\*")[^"\\]+/gi, '$1<masked>').replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>');
const log = (...a) => console.log(redact(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')));
(async () => {
  const AF = Object.getPrototypeOf(async function () { }).constructor;
  const out = await new AF('api', 'sleep', 'arr', 'fs', 'log', 'stream', fs.readFileSync(file, 'utf8'))(api, sleep, arr, fs, log, stream);
  fs.writeFileSync(store, JSON.stringify(tok));
  if (out !== undefined) console.log(redact(JSON.stringify(out, null, 1)));
})().catch(e => { console.error('ERR', String(e.message).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>')); process.exit(1); });
