// Shared helpers for every group script. Never put secrets here (run-code may echo code into logs).
const H = 'https://staging-desk.taviportal.com'; const API = H + '/api/v1';
const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-06_23-09-45';
const SHOT = RUN + '/browser-sessions/' + SESS + '/screenshots';
const M = { tickets: '88e8ea44-1658-4df3-9930-d0902b91073d', contacts: '43004ce2-577f-4eda-b00a-0750fe40c3d4', accounts: '784400e1-4a2a-42c2-b4f3-7ca56e79828a', products: '95b45992-5beb-4f23-b619-e3ae0e304933', calls: 'f7e488b5-0232-42fd-811c-1f24356af653', events: '6fb19115-9356-40f0-b064-840d8f1fad93', tasks: 'd120a6c2-2596-4254-968b-a1bcd3a000bf', contracts: '0924eb24-e42a-4eab-8efd-e3428f19e882' };
const TL = '1b55c25d-eb27-4046-afd1-b292398b435b';
let hdr = null;
const onReq = r => { const h = r.headers(); if (h.authorization && r.url().includes('/api/v1/')) hdr = { authorization: h.authorization, 'x-app-key': h['x-app-key'] || 'desk' }; };
page.on('request', onReq);
const sleep = ms => page.waitForTimeout(ms);
const ensureAuth = async () => { if (!hdr) { await page.goto(H + '/hq', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40 && !hdr; i++) await sleep(500); } };
const api = async (m, p, body, extra) => {
  await ensureAuth();
  const doit = () => page.context().request.fetch(API + p, { method: m, headers: { ...hdr, ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...(extra || {}) }, data: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined, failOnStatusCode: false });
  let r = await doit();
  if (r.status() === 401) { hdr = null; await page.goto(H + '/hq', { waitUntil: 'domcontentloaded' }); await ensureAuth(); r = await doit(); }
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { }
  return { s: r.status(), j, t: t.slice(0, 600) };
};
const R = []; const rec = (id, verdict, note, extra) => R.push({ id, verdict, note, ...(extra || {}) });
const go = async (u, w) => { await page.goto(H + u, { waitUntil: 'domcontentloaded' }); await sleep(w || 6000); };
const txt = async () => (await page.innerText('body'));
const shot = async n => { await page.screenshot({ path: SHOT + '/' + n + '.png' }); return 'screenshots/' + n + '.png'; };
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.fields || x.layouts)) || [];
const step = async (id, fn) => { try { await fn(); } catch (e) { rec(id, 'BLOCKED', 'script error: ' + String(e.message).slice(0, 200)); } try { await page.keyboard.press('Escape'); } catch (e) { } };
const done = () => { page.off('request', onReq); return JSON.stringify(R); };
