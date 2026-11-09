// Round 2 Wave 2 runner: signs in ONCE per account named in the snippet (token kept in memory only, never printed or
// written), then runs the snippet file. Usage: node r2.js <snippet.js> [out.json]. The snippet gets: as(email) -> client
// with get/post/put/patch/del returning {s, j, t}; MODS/LAY; QA prefix; sleep; out (object to fill).
const fs = require('fs'), path = require('path');
const ROOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const API = 'https://staging-crm.taviportal.com/api/v1', TENANT = 'a7a7a7a7-0000-0000-0000-000000000004';
function cred(email) {
  // Edge export without a header row: name,url,username,password (never printed)
  const raw = fs.readFileSync(path.join(ROOT, 'docs/Credentials/Microsoft Edge Passwords.csv'), 'utf8');
  for (const l of raw.split(String.fromCharCode(10))) { const c = l.replace(String.fromCharCode(13), '').split(','); if (c[2] === email && (c[0] + c[1]).includes('staging-crm')) return { email, pw: c[3] }; }
  throw new Error('no credentials for ' + email);
}
const tokens = {};
async function login(email) {
  if (tokens[email]) return tokens[email];
  const c = cred(email);
  const r = await fetch(API + '/iam/auth/login', { method: 'POST', headers: { 'content-type': 'application/json', 'x-tenant-id': TENANT }, body: JSON.stringify({ email, password: c.pw, device_label: 'qa-r2w2', remember_me: false }) });
  if (r.status === 429) throw new Error('HTTP 429 on sign-in for ' + email + ' - STOP');
  const j = await r.json(); if (!j.data || !j.data.access_token) throw new Error('sign-in failed ' + email + ' ' + r.status);
  return (tokens[email] = j.data.access_token);
}
function as(email) {
  const call = async (m, p, body) => {
    const t = await login(email);
    const r = await fetch(API + p, { method: m, headers: { authorization: 'Bearer ' + t, 'x-tenant-id': TENANT, 'x-app-key': 'crm', ...(body !== undefined ? { 'content-type': 'application/json' } : {}) }, body: body !== undefined ? JSON.stringify(body) : undefined });
    if (r.status === 429) throw new Error('HTTP 429 on ' + m + ' ' + p + ' - STOP');
    const txt = await r.text(); let j = null; try { j = JSON.parse(txt); } catch (e) {}
    return { s: r.status, j, t: txt.slice(0, 1500) };
  };
  return { get: p => call('GET', p), post: (p, b) => call('POST', p, b === undefined ? {} : b), put: (p, b) => call('PUT', p, b), patch: (p, b) => call('PATCH', p, b), del: p => call('DELETE', p) };
}
const MODS = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', contacts: '6f553963-01d6-4b68-9fb3-143d23044c41', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', accounts: 'b2398920-2914-4836-be53-81bd960effea', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', calls: 'e72e608a-a5d3-45cf-888a-dfadc6e8b456', meetings: 'f13e02be-03d3-46c3-a74e-22c7770823ca', subscriptions: '6d053261-6a93-4042-8496-19eeac878e32', agency: '30aba3c3-967a-4b47-962e-b4c0771c1250', services: 'eae451c0-aca2-40e9-87c5-8640e9a47325', dailymove: 'ad7879e0-69b0-4e73-a2a7-3be6ca155285', cases: '64d25249-e282-49a6-ad9d-c840004ede0d', po: '8fcdd3c2-5f97-4da6-a0bb-cc566285d14c', so: '91bb42eb-2f8e-4738-b3be-ffd465aee569', ndcagencies: '6e0e9833-4e32-4940-ab21-683cb7bc17d2' };
const LAY = { leads:'bf971461-2edc-45f2-b6e4-6e180aa64288', contacts:'92269f8a-040c-4b00-8d33-cc323391dc3b', deals:'fcba0068-d67f-44f5-8412-cdef9c09e16e', accounts:'d817ff75-2107-4114-9141-71f5efbc04cf', tasks:'40c084f2-f062-45d5-ac70-132a7597fac0', calls:'58707442-1395-4eed-a015-be8280c9b4e6', meetings:'07224366-ebdc-4b6e-97c3-7a221d197d10', subscriptions:'f7156bdb-3581-4ec1-ad66-68af3236793b', agency:'c50b3765-4493-48d8-bd76-26ba7a97987f', services:'6412c81d-70b7-4a12-a585-baac18c13b61', dailymove:'15e0723f-afef-47e5-95cf-38f0c8e8d7f1', cases:'85e2cd1c-3139-436c-b06e-fbb91db46df3', po:'0f39965b-5894-4f92-9e90-c61092ddefe9', so:'43d321df-262d-4183-ad42-13114366b464', ndcagencies:'02c2efc5-6c56-4945-abf5-d9cb232cd066' };
const OWNER = 'ndc-staging-owner@taviportal.com', U1 = 'nameb56175@airhemp.com', ADMA = 'mmohamed@anyware.software';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const s = v => ({ kind: 'string', value: v });
const enc = o => Object.entries(o).map(([f, v]) => ({ field: f, value: v && typeof v === 'object' && v.kind ? v : s(v) }));
const val = (j, f) => { const arr = j && j.data && j.data.data; if (!Array.isArray(arr)) return undefined; const x = arr.find(e => e.field === f); return x && (x.value && x.value.value !== undefined ? x.value.value : x.value); };
(async () => {
  const [snip, outFile] = process.argv.slice(2);
  const out = {};
  const fn = new (Object.getPrototypeOf(async function () {}).constructor)('as', 'MODS', 'LAY', 'OWNER', 'U1', 'ADMA', 'sleep', 's', 'enc', 'val', 'out', 'require', fs.readFileSync(snip, 'utf8'));
  try { await fn(as, MODS, LAY, OWNER, U1, ADMA, sleep, s, enc, val, out, require); } catch (e) { out.__error = String(e.message || e).slice(0, 400); }
  const txt = JSON.stringify(out, null, 1);
  if (outFile) fs.writeFileSync(outFile, txt);
  console.log(txt.length > 6000 ? txt.slice(0, 6000) + '\n…(truncated, see file)' : txt);
})();
