// Shared helpers for every group script. Never put secrets here (run-code may echo code into logs).
const H = 'https://staging-desk.taviportal.com'; const API = H + '/api/v1';
const RUN = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive';
const SHOT = RUN + '/evidence/raw';
let hdr = null;
const onReq = r => { const h = r.headers(); if (h.authorization && r.url().includes('/api/v1/')) hdr = { authorization: h.authorization, 'x-app-key': h['x-app-key'] || 'desk' }; };
page.on('request', onReq);
const sleep = ms => page.waitForTimeout(ms);
const ensureAuth = async () => { if (!hdr) { await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); for (let i = 0; i < 200 && !hdr; i++) await sleep(500); if (!hdr) throw new Error('SIGNED_OUT: no authorised request on /hq (' + ((await txt()).includes('Sign in') ? 'sign-in page shown' : 'unknown') + ')'); } };
const api = async (m, p, body, extra) => {
  await ensureAuth();
  const doit = () => page.context().request.fetch(API + p, { method: m, headers: { ...hdr, ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...(extra || {}) }, data: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined, failOnStatusCode: false, timeout: 25000 });
  let r = await doit();
  if (r.status() === 401) { hdr = null; await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); await ensureAuth(); r = await doit(); }
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { }
  return { s: r.status(), j, t: t.slice(0, 600) };
};
const R = []; const rec = (id, verdict, note, extra) => R.push({ id, verdict, note, ...(extra || {}) });
const go = async (u, w) => { await page.goto(H + u, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(w || 6000); };
const txt = async () => (await page.innerText('body'));
const shot = async n => { try { await page.screenshot({ path: SHOT + '/' + n + '.png', timeout: 15000 }); return n + '.png'; } catch (e) { return 'screenshot failed: ' + String(e.message).slice(0, 40); } };
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.fields || x.layouts)) || [];
const step = async (id, fn) => { try { await fn(); } catch (e) { rec(id, 'BLOCKED', 'script error: ' + String(e.message).slice(0, 200)); } try { await page.keyboard.press('Escape'); } catch (e) { } };
const done = o => { page.off('request', onReq); return JSON.stringify(o === undefined ? R : o); };
