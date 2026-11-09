// Tiny API client for Lane A (Wave 3). Signs in ONCE per account per process (password read from the Edge export, never printed).
require('dns').setDefaultResultOrder('ipv4first');
// Usage: node api.js <accountEmail> <snippet.js> [out.json]  — the snippet is the body of an async function with `call` and `out`.
const fs = require('fs'), path = require('path');
const ROOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const B = 'https://staging-crm.taviportal.com/api/v1', T = 'a7a7a7a7-0000-0000-0000-000000000004';
const [email, snippet, outFile] = process.argv.slice(2);
function pw(e) {
  for (const l of fs.readFileSync(path.join(ROOT, 'docs/Credentials/Microsoft Edge Passwords.csv'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const c = l.split(','); if (c[0] === 'staging-crm.taviportal.com' && c[2] === e) return c.slice(3).join(',');
  }
  throw new Error('no credentials for ' + e);
}
(async () => {
  let lr; for (let a = 0; ; a++) { try { lr = await fetch(B + '/iam/auth/login', { method: 'POST', headers: { 'content-type': 'application/json', 'x-tenant-id': T }, body: JSON.stringify({ email, password: pw(email), device_label: 'qa-w3', remember_me: false }) }); break; } catch (e) { if (a >= 3) throw e; await new Promise(z => setTimeout(z, 4000)); } }
  if (lr.status === 429) { console.error('STOP: 429 on sign-in'); process.exit(3); }
  if (!lr.ok) { console.error('sign-in failed', lr.status); process.exit(2); }
  const tok = (await lr.json()).data.access_token;
  const call = async (m, p, body) => {
    for (let a = 0; ; a++) {
      try {
        const r = await fetch(B + p, { method: m, headers: { authorization: 'Bearer ' + tok, 'x-tenant-id': T, 'x-app-key': 'crm', ...(body !== undefined ? { 'content-type': 'application/json' } : {}) }, body: body !== undefined ? JSON.stringify(body) : undefined });
        if (r.status === 429) { console.error('STOP: 429 on ' + p); process.exit(3); }
        const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {}
        if ((r.status === 502 || r.status === 503 || r.status === 504) && a < 3) throw new Error('gateway ' + r.status);
        return { s: r.status, j, t: t.slice(0, 3000) };
      } catch (e) { if (a >= 3) throw e; await new Promise(z => setTimeout(z, 4000 * (a + 1))); }
    }
  };
  const out = {};
  const fn = new (Object.getPrototypeOf(async function () {}).constructor)('call', 'out', 'require', fs.readFileSync(snippet, 'utf8'));
  const res = await fn(call, out, require);
  const text = JSON.stringify(res === undefined ? out : res, null, 1);
  if (outFile) fs.writeFileSync(outFile, text); else console.log(text.slice(0, 20000));
})().catch(e => { console.error('ERR', e.message, e.cause && (e.cause.code || e.cause.message)); process.exit(1); });
