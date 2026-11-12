// K2: sign in once as another tenant's owner (creds from env, never printed) and call NDC rule ids
const fs = require('fs'); const I = { crm: require('../out/ids-crm.json'), desk: require('../out/ids-desk.json') };
const out = {};
(async () => {
  for (const app of ['crm', 'desk']) {
    const API = 'https://staging-' + app + '.taviportal.com/api/v1'; const H = { 'content-type': 'application/json', 'x-app-key': app, 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000002' };
    let tokn = globalThis.__T; let L = { status: 'reused' }, lj = {}; if (!tokn) { L = await fetch(API + '/iam/auth/login', { method: 'POST', headers: H, body: JSON.stringify({ email: process.env.K2U, password: process.env.K2P, device_label: 'qa-automation', remember_me: false }) });
    lj = await L.json().catch(() => ({})); tokn = lj.data && lj.data.access_token; globalThis.__T = tokn; } out[app] = { login: L.status + (tokn ? '' : ' ' + JSON.stringify(lj).slice(0, 200)) };
    if (!tokn) { if (L.status === 429) break; continue; }
    const claims = JSON.parse(Buffer.from(tokn.split('.')[1], 'base64url').toString()); const ten = claims.tenant_id || claims.tid || claims.tenantId; out[app].tenantIsNDC = ten === 'a7a7a7a7-0000-0000-0000-000000000004'; out[app].claimKeys = Object.keys(claims).join(',');
    const A = { ...H, authorization: 'Bearer ' + tokn }; const call = async (m, p, b, extra = {}) => { const r = await fetch(API + p, { method: m, headers: { ...A, ...extra }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); return r.status + ' ' + t.slice(0, 160); };
    const mid = I[app][app === 'crm' ? 'mod_leads' : 'mod_desk_tickets']; const rid = I[app].b4_active;
    out[app].get = await call('GET', '/modules/' + mid + '/layout-rules/' + rid);
    out[app].list = await call('GET', '/modules/' + mid + '/layout-rules');
    out[app].put = await call('PUT', '/modules/' + mid + '/layout-rules/' + rid, { name: 'QA LR1112 K2 hacked', rowVersion: 1 });
    out[app].del = await call('DELETE', '/modules/' + mid + '/layout-rules/' + rid);
    // forged tenant header pointing at NDC
    out[app].getForged = await call('GET', '/modules/' + mid + '/layout-rules/' + rid, null, { 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' });
    out[app].delForged = await call('DELETE', '/modules/' + mid + '/layout-rules/' + rid, null, { 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' });
  }
  console.log(JSON.stringify(out, null, 1).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<email>'));
})();
