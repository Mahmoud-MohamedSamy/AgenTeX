// NDC-Staging Desk: sign in once per account (passwords read from docs/Credentials, never printed), list tenants/agents/departments.
// Usage: node ndc-probe.js <email> [<email>...]
const fs = require('fs'); const path = require('path');
const P = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX'; const H = 'https://staging-desk.taviportal.com/api/v1';
function pw(email) {
  for (const f of (process.env.PWF ? [process.env.PWF] : ['docs/Credentials/TAVI Desk Credentials.csv', 'docs/Credentials/Microsoft Edge Passwords.csv'])) {
    for (const line of fs.readFileSync(path.join(P, f), 'utf8').split(/\r?\n/)) { const c = line.split(','); const i = c.indexOf(email); if (i >= 0 && c[i + 1]) return c[i + 1]; }
  }
  return null;
}
(async () => {
  const out = {};
  for (const email of process.argv.slice(2)) {
    const p = pw(email); if (!p) { out[email] = 'no password row'; continue; }
    const r = await fetch(H + '/iam/auth/login', { method: 'POST', headers: { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': process.env.TEN || 'a7a7a7a7-0000-0000-0000-000000000004' }, body: JSON.stringify({ email, password: p, device_label: 'qa-automation', remember_me: true }) });
    if (r.status === 429) { out[email] = '429 STOP'; break; }
    const j = await r.json().catch(() => ({}));
    const d = j.data || {}; const tok = d.access_token;
    out[email] = { login: r.status, err: j.error && j.error.code, tokenLen: tok ? tok.length : 0, tenants: (d.tenants || d.organizations || d.memberships || []).map(t => ({ id: t.id || t.tenant_id, name: t.name || t.tenant_name, role: t.role })), keys: Object.keys(d) };
    if (tok) fs.writeFileSync(path.join(process.env.SCR, 'ndc-' + email.split('@')[0] + '.tok'), JSON.stringify({ a: tok, r: d.refresh_token, at: Date.now() }));
    console.log(email, JSON.stringify(out[email]).slice(0, 600));
  }
})();
