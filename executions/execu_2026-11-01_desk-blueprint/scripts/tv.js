// TAVI Desk staging API helper (org Anyware, owner). One sign-in, then the token pair is cached in the session
// scratchpad (TV_CACHE env or ./.tv-token.json next to the caller) and refreshed - never printed.
// Password: read from automation/.auth/extra-credentials.csv (gitignored), never printed.
const fs = require('fs'), path = require('path');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const H = 'https://staging-desk.taviportal.com/api/v1';
const TENANT = 'a7a7a7a7-0000-0000-0000-000000000002';
const OWNER = 'anyware-staging-owner@anyware.software';
const TICKETS = 'e8e5e302-3873-4e32-b945-c9cd25c7659d';
const QA_DEPT = '9a7e391c-be72-49e4-a1cf-763e5c88e23d';
const CACHE = process.env.TV_CACHE || path.join(process.cwd(), '.tv-token.json');
const BASE = { 'content-type': 'application/json', 'x-tenant-id': TENANT, 'x-app-key': 'desk' };

function password() {
  const rows = fs.readFileSync(path.join(P, 'automation/.auth/extra-credentials.csv'), 'utf8').split(/\r?\n/);
  for (const r of rows) { const c = r.split(','); if (c[0] === 'staging-desk.taviportal.com' && c[2] === OWNER) return c.slice(3).join(','); }
  throw new Error('no credentials row');
}
async function login() {
  const r = await fetch(H + '/iam/auth/login', { method: 'POST', headers: BASE, body: JSON.stringify({ email: OWNER, password: password(), device_label: 'qa-automation', remember_me: true }) });
  if (r.status === 429) throw new Error('429 on sign-in - STOP');
  const j = await r.json(); if (!j.data || !j.data.access_token) throw new Error('sign-in failed ' + r.status);
  save(j.data.access_token, j.data.refresh_token); return j.data.access_token;
}
function save(a, rf) { fs.writeFileSync(CACHE, JSON.stringify({ a, r: rf, at: Date.now() })); }
async function token() {
  let c = null; try { c = JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { }
  if (!c) return login();
  if (Date.now() - c.at < 4 * 60000) return c.a;
  const r = await fetch(H + '/iam/auth/refresh', { method: 'POST', headers: BASE, body: JSON.stringify({ refresh_token: c.r }) });
  if (r.status === 429) throw new Error('429 on refresh - STOP');
  const j = await r.json().catch(() => ({}));
  if (j && j.data && j.data.access_token) { save(j.data.access_token, j.data.refresh_token || c.r); return j.data.access_token; }
  return login();
}
async function call(method, p, body) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(H + p, { method, headers: { ...BASE, authorization: 'Bearer ' + await token() }, body: body === undefined ? undefined : JSON.stringify(body) });
      if (r.status === 429) throw Object.assign(new Error('429 - STOP'), { stop: true });
      if ([502, 503, 504].includes(r.status)) { await sleep(3000 * (i + 1)); continue; }
      const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch { }
      return { status: r.status, json: j, text: t };
    } catch (e) { if (e.stop || i === 3) throw e; await sleep(3000 * (i + 1)); }
  }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const v = x => typeof x === 'number' ? { kind: 'number', value: x } : { kind: 'string', value: String(x) };
async function ticket(subject, extra = {}) {
  if (!subject.includes('QA')) throw new Error('QA only');
  const f = { subject, department: QA_DEPT, status: 'Open', ...extra };
  const r = await call('POST', `/modules/${TICKETS}/records`, { data: Object.entries(f).map(([field, val]) => ({ field, value: v(val) })) });
  if (Math.floor(r.status / 100) !== 2) throw new Error('ticket ' + r.status + ' ' + r.text.slice(0, 300));
  return r.json.data.id;
}
async function blueprint(def, isActive) {
  if (!String(def.name).startsWith('QA BP ')) throw new Error('QA only');
  return call('POST', `/modules/${TICKETS}/blueprints`, { definition: def, isActive });
}
async function stateOf(t) { const r = await call('GET', `/modules/${TICKETS}/records/${t}/blueprint-state`); return (r.json && r.json.data && r.json.data.states || [])[0] || null; }
async function cleanup(tickets = [], bps = []) {
  const out = [];
  for (const t of tickets) { await call('POST', `/desk/tickets/${t}/blueprint/revoke`, {}); out.push('ticket ' + (await call('DELETE', `/modules/${TICKETS}/records/${t}`)).status); }
  for (const b of bps) { await call('POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); out.push('bp ' + (await call('DELETE', `/modules/${TICKETS}/blueprints/${b}`)).status); }
  return out.join(', ');
}
module.exports = { call, token, ticket, blueprint, stateOf, cleanup, sleep, v, H, TENANT, TICKETS, QA_DEPT, OWNER, password };
// NOTE: do not use - sharing the API token pair with a browser revokes both sessions (reason=revoked). Use ui-login.js state instead.
async function browserState(lang = 'en') {
  await token(); const c = JSON.parse(fs.readFileSync(CACHE, 'utf8')); const exp = Date.now() / 1000 + 3600 * 24;
  const ck = (name, value) => ({ name, value, domain: '.taviportal.com', path: '/', expires: exp, httpOnly: false, secure: true, sameSite: 'Lax' });
  return { cookies: [ck('aw_staging_access_token', c.a), ck('aw_staging_refresh_token', c.r)],
    origins: [{ origin: 'https://staging-desk.taviportal.com', localStorage: [{ name: 'aw_auth_tenant_id', value: TENANT }, { name: 'anyware_language', value: lang }, { name: 'aw:activity:last', value: String(Date.now()) }] }] };
}
module.exports.browserState = browserState;
