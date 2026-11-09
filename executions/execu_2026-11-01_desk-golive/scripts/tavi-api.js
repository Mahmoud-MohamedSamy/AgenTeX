// TAVI Desk API helper (no browser). Signs in as WHO from CREDS once, caches the token in the scratchpad (never printed),
// then runs the calls in <calls.json> = [{"m":"GET","p":"/desk/departments","b":{...},"save":"name","as":"var"}...].
// "${var.path}" inside p or b is replaced by a value saved earlier with "as" (path into the response JSON).
// Usage: CREDS=<creds.json> WHO=<email> node tavi-api.js <calls.json> [outDir]
const fs = require('fs'), path = require('path');
const H = process.env.HOST || 'https://staging-desk.taviportal.com', API = H + '/api/v1', TENANT = process.env.TENANT || 'a7a7a7a7-0000-0000-0000-000000000004';
const SCR = path.dirname(process.env.CREDS); const TOK = path.join(SCR, 'tok-' + (process.env.WHO || 'x').replace(/[^a-z0-9]/gi, '_') + '.json');
const base = { 'content-type': 'application/json', 'x-tenant-id': TENANT, 'x-app-key': 'desk' };
const vars = {}; const sub = s => typeof s === 'string' ? s.replace(/\$\{([^}]+)\}/g, (_, k) => { const [v, ...p] = k.split('.'); let o = vars[v]; for (const q of p) o = o == null ? o : o[q]; return o == null ? '' : o; }) : s;
const deep = o => o == null ? o : Array.isArray(o) ? o.map(deep) : typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, deep(v)])) : sub(o);
async function login() {
  const c = JSON.parse(fs.readFileSync(process.env.CREDS, 'utf8'))[process.env.WHO];
  const r = await fetch(API + '/iam/auth/login', { method: 'POST', headers: base, body: JSON.stringify({ email: c.user, password: c.pw, device_label: 'qa-ndc-mimic', remember_me: true }), signal: AbortSignal.timeout(90000) });
  const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error('login ' + r.status + ' ' + JSON.stringify(j.error || '').slice(0, 120));
  const t = { a: j.data.access_token, r: j.data.refresh_token, at: Date.now() }; fs.writeFileSync(TOK, JSON.stringify(t)); return t;
}
async function token() {
  let t = null; try { t = JSON.parse(fs.readFileSync(TOK, 'utf8')); } catch (e) { }
  if (t && Date.now() - t.at < 4 * 60000) return t.a;
  if (t && t.r) { const r = await fetch(API + '/iam/auth/refresh', { method: 'POST', headers: base, body: JSON.stringify({ refresh_token: t.r }), signal: AbortSignal.timeout(90000) }).catch(() => null);
    const j = r && await r.json().catch(() => null); if (r && r.ok && j && j.data) { t = { a: j.data.access_token, r: j.data.refresh_token || t.r, at: Date.now() }; fs.writeFileSync(TOK, JSON.stringify(t)); return t.a; } }
  return (await login()).a;
}
(async () => {
  const calls = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const out = process.argv[3]; if (out) fs.mkdirSync(out, { recursive: true });
  for (const c of calls) {
    const p = sub(c.p); let r, t = '', j = null;
    for (let k = 0; k < 3; k++) { try { r = await fetch(API + p, { method: c.m || 'GET', headers: { ...base, authorization: 'Bearer ' + await token(), ...(c.h || {}) }, body: c.b !== undefined ? JSON.stringify(deep(c.b)) : undefined, signal: AbortSignal.timeout(90000) }); t = await r.text(); break; } catch (e) { t = 'NETERR ' + e.message; r = null; await new Promise(z => setTimeout(z, 4000)); } }
    try { j = JSON.parse(t); } catch (e) { }
    if (c.as && j) vars[c.as] = j.data !== undefined ? j.data : j;
    if (out && c.save) fs.writeFileSync(path.join(out, c.save + '.json'), t);
    const d = j && j.data; const n = Array.isArray(d) ? 'n=' + d.length : d && typeof d === 'object' ? Object.keys(d).slice(0, 8).join(',') : '';
    const e = j && j.error ? ' ERR ' + (j.error.code + ': ' + j.error.message + ' ' + JSON.stringify(j.error.details || '')).slice(0, 300) : '';
    console.log((r ? r.status : 'NET') + ' ' + (c.m || 'GET') + ' ' + p.slice(0, 90) + ' :: ' + (e || n || t.slice(0, 160)));
  }
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
