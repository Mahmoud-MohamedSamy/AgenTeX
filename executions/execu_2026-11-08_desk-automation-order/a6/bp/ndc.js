// NDC-Staging Desk API helper. One sign-in per account (token cached in the scratchpad, refreshed only when it stops working).
// Passwords come from docs/Credentials/TAVI Desk Credentials.csv and are never printed. Stops on 429.
const fs = require('fs'), path = require('path');
const P = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX';
const H = 'https://staging-desk.taviportal.com/api/v1';
const TENANT = 'a7a7a7a7-0000-0000-0000-000000000004';
const SCR = process.env.SCR || 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/e12f27e4-edb0-452a-a10f-0861faf81818/scratchpad';
const U = { owner: 'ndc-staging-owner@anyware.software', A: 'fedelav803@meinvr.com', B: 'kinase5517@meinvr.com', C: 'pacox68754@meinvr.com' };
const ID = { owner: '97be04b6-0a08-4883-aa51-e1650b11cab7', A: '9d182dfa-05f3-4af7-9685-8615a2fbe537', B: '2a7c1bc4-f6d4-4bd3-805e-0496ece13987', C: '876ce871-2b02-4854-89a7-68050391c62b' };
const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', TECH = '19510fdc-91f3-4a7a-8888-153f1318b765';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const tokFile = who => path.join(SCR, 'ndc-' + U[who].split('@')[0] + '.tok');
function pw(email) {
  for (const line of fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/)) { const c = line.split(','); const i = c.indexOf(email); if (i >= 0 && c[i + 1]) return c[i + 1]; }
  throw new Error('no password row for ' + email);
}
const logins = {};
async function login(who) {
  if (logins[who]) throw new Error('second login refused for ' + who); logins[who] = 1;
  const r = await fetch(H + '/iam/auth/login', { method: 'POST', headers: { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': TENANT }, body: JSON.stringify({ email: U[who], password: pw(U[who]), device_label: 'qa-automation', remember_me: true }) });
  if (r.status === 429) throw Object.assign(new Error('429 STOP'), { stop: true });
  const j = await r.json().catch(() => ({})); const t = j.data && j.data.access_token;
  if (!t) throw new Error('login ' + who + ' ' + r.status + ' ' + (j.error && j.error.code));
  fs.writeFileSync(tokFile(who), JSON.stringify({ a: t, r: j.data.refresh_token, at: Date.now() })); return t;
}
const toks = {};
async function token(who) {
  if (toks[who]) return toks[who];
  try { toks[who] = JSON.parse(fs.readFileSync(tokFile(who), 'utf8')).a; } catch { toks[who] = await login(who); }
  return toks[who];
}
async function call(who, method, p, body, retried) {
  for (let i = 0; i < 4; i++) {
    try {
      const headers = { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': TENANT };
      if (who) headers.authorization = 'Bearer ' + await token(who);
      const r = await fetch(H + p, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
      if (r.status === 429) throw Object.assign(new Error('429 STOP'), { stop: true });
      if (r.status === 401 && who && !retried) { toks[who] = await login(who); return call(who, method, p, body, true); }
      if ([502, 503, 504].includes(r.status)) { await sleep(3000 * (i + 1)); continue; }
      const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch { }
      return { status: r.status, json: j, text: t, code: j && j.error && j.error.code, msg: j && j.error && j.error.message };
    } catch (e) { if (e.stop || i === 3 || /login|password/.test(e.message)) throw e; await sleep(3000 * (i + 1)); }
  }
}
module.exports = { call, token, sleep, U, ID, CS, TECH, H, TENANT };
