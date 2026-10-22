// Shared helpers for the staging-crm retest. Never put secrets here.
const H = 'https://staging-crm.taviportal.com'; const API = H + '/api/v1';
const SHOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-21_retest-mahmoudmohamed/screenshots/raw';
let hdr = globalThis.__hdr || null;
const onReq = r => { const h = r.headers(); if (h.authorization && r.url().includes('/api/')) { hdr = { authorization: h.authorization }; for (const k of Object.keys(h)) if (/^x-/.test(k)) hdr[k] = h[k]; globalThis.__hdr = hdr; } };
page.on('request', onReq);
const sleep = ms => page.waitForTimeout(ms);
const txt = async () => (await page.innerText('body'));
const ensureAuth = async () => { if (!hdr) { const ck = (await page.context().cookies()).find(c => c.name === 'aw_staging_access_token'); if (ck) { hdr = { authorization: 'Bearer ' + ck.value, 'x-app-key': 'crm' }; return; } }
  if (!hdr) { await page.goto(H + '/', { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); for (let i = 0; i < 120 && !hdr; i++) await sleep(500); if (!hdr) throw new Error('SIGNED_OUT'); } };
const api = async (m, p, body) => { await ensureAuth();
  const doit = () => page.context().request.fetch((p.startsWith('http') ? '' : API) + p, { method: m, headers: { ...hdr, ...(body !== undefined ? { 'content-type': 'application/json' } : {}) }, data: body !== undefined ? JSON.stringify(body) : undefined, failOnStatusCode: false });
  let r = await doit(); if (r.status() === 401) { hdr = null; globalThis.__hdr = null; await ensureAuth(); r = await doit(); }
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { } return { s: r.status(), j, t: t.slice(0, 3000) }; };
const go = async (u, w) => { await page.goto(H + u, { waitUntil: 'commit', timeout: 90000 }); await sleep(w || 7000); };
const shot = async n => { await page.screenshot({ path: SHOT + '/' + n + '.png' }); return n + '.png'; };
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
const cap = []; const capOn = () => { const f = r => { const u = r.url(); if (u.includes('/api/') && !/heartbeat|presence|\/iam\/auth|\/auth\//.test(u)) cap.push(r.method() + ' ' + u.replace(API, '') + ' ' + (r.postData() || '').slice(0, 800)); }; page.on('request', f); return () => page.off('request', f); };
const done = o => { page.off('request', onReq); return JSON.stringify(o); };
