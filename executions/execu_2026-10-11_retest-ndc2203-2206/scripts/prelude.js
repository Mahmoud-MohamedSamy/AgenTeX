// Shared helpers for desk.anyware.software retest. Never put secrets here.
const H = 'https://desk.anyware.software'; const API = H + '/api/v1';
const SHOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-11_retest-ndc2203-2206/screenshots';
let hdr = null;
const onReq = r => { const h = r.headers(); if (h.authorization && r.url().includes('/api/v1/')) hdr = { authorization: h.authorization, 'x-app-key': h['x-app-key'] || 'desk' }; };
page.on('request', onReq);
const sleep = ms => page.waitForTimeout(ms);
const txt = async () => (await page.innerText('body'));
const ensureAuth = async () => { if (!hdr) { await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); for (let i = 0; i < 120 && !hdr; i++) await sleep(500); if (!hdr) throw new Error('SIGNED_OUT'); } };
const api = async (m, p, body) => { await ensureAuth();
  const doit = () => page.context().request.fetch(API + p, { method: m, headers: { ...hdr, ...(body !== undefined ? { 'content-type': 'application/json' } : {}) }, data: body !== undefined ? JSON.stringify(body) : undefined, failOnStatusCode: false });
  let r = await doit(); if (r.status() === 401) { hdr = null; await ensureAuth(); r = await doit(); }
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { } return { s: r.status(), j, t: t.slice(0, 2000) }; };
const go = async (u, w) => { await page.goto(H + u, { waitUntil: 'commit', timeout: 90000 }); await sleep(w || 7000); };
const shot = async n => { await page.screenshot({ path: SHOT + '/' + n + '.png' }); return 'screenshots/' + n + '.png'; };
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results)) || [];
const cap = []; const capOn = () => { const f = r => { const u = r.url(); if (u.includes('/api/v1/') && !/heartbeat|presence|\/iam\/auth|resolved-batch/.test(u)) cap.push(r.method() + ' ' + u.replace(API, '') + ' ' + (r.postData() || '').slice(0, 1500)); }; page.on('request', f); return () => page.off('request', f); };
const capResp = []; const respOn = () => { const f = async r => { const u = r.url(); if (u.includes('/api/v1/') && r.request().method() !== 'GET' && !/heartbeat|presence|\/iam\/auth/.test(u)) { let b = ''; try { b = (await r.text()).slice(0, 800); } catch (e) { } capResp.push(r.status() + ' ' + r.request().method() + ' ' + u.replace(API, '') + ' ' + b); } }; page.on('response', f); return () => page.off('response', f); };
const done = o => { page.off('request', onReq); return JSON.stringify(o); };
