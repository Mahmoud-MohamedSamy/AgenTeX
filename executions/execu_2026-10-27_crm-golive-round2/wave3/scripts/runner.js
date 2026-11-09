// Round 2 Wave 3 snippet runner: ONE long-running process that signs each account in ONCE (lazily) and keeps the token in
// memory only (never on disk, never printed). Snippets are posted to http://127.0.0.1:47833/run as
// {"as": "<email>", "file": "<abs path to snippet.js>", "out": "<abs path for the JSON result>"}; the snippet is the body of
// an async function with `call(method, path, body)` and `out` available. A 429 anywhere stops the runner for good.
// Start:  node runner.js   (background).  Stop: POST /stop.
require('dns').setDefaultResultOrder('ipv4first');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const B = 'https://staging-crm.taviportal.com/api/v1', T = 'a7a7a7a7-0000-0000-0000-000000000004';
const sessions = {};
let stopped = null;
function pw(e) {
  for (const l of fs.readFileSync(path.join(ROOT, 'docs/Credentials/Microsoft Edge Passwords.csv'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const c = l.split(','); if (c[0] === 'staging-crm.taviportal.com' && c[2] === e) return c.slice(3).join(',');
  }
  throw new Error('no credentials for ' + e);
}
async function signIn(email) {
  if (stopped) throw new Error(stopped);
  const r = await fetch(B + '/iam/auth/login', { method: 'POST', headers: { 'content-type': 'application/json', 'x-tenant-id': T },
    body: JSON.stringify({ email, password: pw(email), device_label: 'qa-r2w3', remember_me: false }) });
  if (r.status === 429) { stopped = 'STOP: 429 on sign-in for ' + email; throw new Error(stopped); }
  if (!r.ok) throw new Error('sign-in failed ' + r.status + ' for ' + email);
  const d = (await r.json()).data;
  sessions[email] = { tok: d.access_token, ref: d.refresh_token, at: Date.now() };
  console.log('[runner] signed in ' + email + ' (once)');
}
async function token(email) {
  const s = sessions[email];
  if (!s) { await signIn(email); return sessions[email].tok; }
  if (Date.now() - s.at > 4 * 60000) {
    const r = await fetch(B + '/iam/auth/refresh', { method: 'POST', headers: { 'content-type': 'application/json', 'x-tenant-id': T }, body: JSON.stringify({ refresh_token: s.ref }) });
    if (r.status === 429) { stopped = 'STOP: 429 on refresh for ' + email; throw new Error(stopped); }
    if (r.ok) { const d = (await r.json()).data; s.tok = d.access_token; if (d.refresh_token) s.ref = d.refresh_token; s.at = Date.now(); }
    else { delete sessions[email]; await signIn(email); }
  }
  return sessions[email].tok;
}
function caller(email) {
  return async (m, p, body) => {
    for (let a = 0; ; a++) {
      try {
        const tok = await token(email);
        const r = await fetch(B + p, { method: m, headers: { authorization: 'Bearer ' + tok, 'x-tenant-id': T, 'x-app-key': 'crm', ...(body !== undefined ? { 'content-type': 'application/json' } : {}) }, body: body !== undefined ? JSON.stringify(body) : undefined });
        if (r.status === 429) { stopped = 'STOP: 429 on ' + p; throw new Error(stopped); }
        if (r.status === 401 && a === 0) { sessions[email].at = 0; continue; }
        const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {}
        if ((r.status === 502 || r.status === 503 || r.status === 504) && a < 3) throw new Error('gateway ' + r.status);
        return { s: r.status, j, t: t.slice(0, 4000) };
      } catch (e) { if (stopped || a >= 3) throw e; await new Promise(z => setTimeout(z, 4000 * (a + 1))); }
    }
  };
}
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
http.createServer((req, res) => {
  let body = ''; req.on('data', c => body += c); req.on('end', async () => {
    if (req.url === '/stop') { res.end('bye'); setTimeout(() => process.exit(0), 100); return; }
    try {
      if (stopped) throw new Error(stopped);
      const q = JSON.parse(body);
      const fn = new AsyncFunction('call', 'out', 'callAs', fs.readFileSync(q.file, 'utf8'));
      const out = {};
      const result = await fn(caller(q.as), out, e => caller(e));
      const json = JSON.stringify(result === undefined ? out : result, null, 1);
      if (q.out) fs.writeFileSync(q.out, json);
      res.end(json.length > 6000 ? json.slice(0, 6000) + '\n…(truncated; full result in ' + q.out + ')' : json);
    } catch (e) { res.statusCode = 500; res.end('ERR ' + e.message); }
  });
}).listen(47833, '127.0.0.1', () => console.log('[runner] listening on 127.0.0.1:47833'));
