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
const ensureAuth = async () => { if (!hdr) { await page.goto(H + '/hq', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40 && !hdr; i++) await sleep(500); if (!hdr) throw new Error('SIGNED_OUT: no authorised request on /hq (' + ((await txt()).includes('Sign in') ? 'sign-in page shown' : 'unknown') + ')'); } };
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
const shot = async n => { try { await page.screenshot({ path: SHOT + '/' + n + '.png', timeout: 15000 }); return 'screenshots/' + n + '.png'; } catch (e) { return 'screenshot failed: ' + String(e.message).slice(0, 40); } };
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.fields || x.layouts)) || [];
const step = async (id, fn) => { try { await fn(); } catch (e) { rec(id, 'BLOCKED', 'script error: ' + String(e.message).slice(0, 200)); } try { await page.keyboard.press('Escape'); } catch (e) { } };
const done = () => { page.off('request', onReq); return JSON.stringify(R); };
// ---- run-2 helpers (setup via API, checks via UI where the row is about the screen)
const TS = 'a641f1df-f2c6-450e-a881-857776dacf70';
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : (v && typeof v === 'object') ? { kind: 'object', properties: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } : { kind: 'string', value: String(v) };
const mods = async () => arr((await api('GET', '/modules')).j.data);
const mkModule = async (key, plural, scope) => { let m = (await mods()).find(x => x.moduleKey === key || x.moduleKey === 'desk_' + key); if (!m) { const r = await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: key, labels: { en: plural }, pluralForm: plural, singularForm: plural + '1', storageScope: scope || 'organization' }); m = r.j && r.j.data; } return m; };
const fieldsOf = async mid => arr((await api('GET', `/modules/${mid}/fields`)).j.data);
const defLayout = async mid => arr((await api('GET', `/modules/${mid}/layouts`)).j.data).find(x => x.isDefault);
const getLayout = async (mid, lid) => (await api('GET', `/modules/${mid}/layouts/${lid}`)).j.data;
const initLayout = async (mid) => { const d = await defLayout(mid); const l = await getLayout(mid, d.id); if (l.views && l.views.CREATE && l.views.CREATE.layout && (l.views.CREATE.layout.sections || []).length) return d.id;
  await go(`/settings/modules-and-fields/${mid}/layouts/${d.id}`, 9000); await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(800); await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000); return d.id; };
const addFields = async (mid, defs) => { const have = new Set((await fieldsOf(mid)).map(f => f.fieldName)); const nw = defs.filter(d => !have.has(d.fieldName)).map(d => ({ labels: { en: 'QA MF ' + d.fieldName.replace(/^qa_/, '') }, required: false, unique: false, uniquePeerModuleIds: [], ...d })); return nw.length ? await api('POST', `/modules/${mid}/fields`, { fields: nw }) : { s: 'exists' }; };
const placeOnLayout = async (mid, lid, names, cfg) => { cfg = cfg || {}; const lay = await getLayout(mid, lid); const F = (await fieldsOf(mid)).filter(f => names.includes(f.fieldName));
  for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = lay.views[v] && lay.views[v].layout && lay.views[v].layout.sections; if (!ss || !ss[0]) continue; const col = ss[0].columns[ss[0].columns.length - 1]; const have = new Set(ss.flatMap(s => s.columns.flatMap(c => c.fields.map(f => f.id))));
    for (const f of F) if (!have.has(f.id)) col.fields.push(JSON.parse(JSON.stringify(f)));
    for (const s of ss) for (const c of s.columns) for (const e of c.fields) if (cfg[e.fieldName]) e.config = { ...(e.config || {}), ...cfg[e.fieldName] }; }
  const b = { ...lay }; delete b.id; return await api('PUT', `/modules/${mid}/layouts/${lid}`, b); };
const mkRec = async (mid, vals, lid) => { const r = await api('POST', `/modules/${mid}/records`, { data: Object.entries(vals).map(([k, v]) => ({ field: k, value: enc(v) })), ...(lid ? { layout_id: lid } : {}) }); return { s: r.s, id: r.j && r.j.data && r.j.data.id, err: ((r.j && r.j.error && (r.j.error.code + ' ' + r.j.error.message)) || '').slice(0, 160), j: r.j }; };
const getRec = async (mid, id) => { const g = (await api('GET', `/modules/${mid}/records/${id}`)).j; const d = (g && g.data && g.data.data) || []; const o = {}; for (const x of d) o[x.field] = x.value; return o; };
const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.kind === 'object' ? v.properties : v.value;
const fieldMenu = async label => { const c = page.getByText(label, { exact: true }); const n = await c.count(); let lab = null;
  for (let i = 0; i < n; i++) { const bb = await c.nth(i).boundingBox().catch(() => null); if (bb && bb.x > 340) { await c.nth(i).scrollIntoViewIfNeeded(); await c.nth(i).hover(); lab = await c.nth(i).boundingBox(); break; } }
  if (!lab) throw new Error('label not on canvas: ' + label); await sleep(600);
  const btns = page.locator('[title="Field options"], [aria-label="Field options"]'); const bn = await btns.count(); let best = null, bd = 1e9;
  for (let i = 0; i < bn; i++) { const bb = await btns.nth(i).boundingBox().catch(() => null); if (!bb) continue; const dy = Math.abs((bb.y + bb.height / 2) - (lab.y + lab.height / 2)); if (bb.x > lab.x && dy < 30 && bb.x - lab.x < 1100 && dy < bd) { bd = dy; best = btns.nth(i); } }
  if (!best) throw new Error('no field options for ' + label); await best.click(); await sleep(700); };
const props = async tab => { await page.getByText('Edit Properties', { exact: true }).first().click(); await sleep(1500); if (tab) { await page.getByText(tab, { exact: true }).first().click(); await sleep(1000); } };
const builder = async (mid, lid) => { await go(`/settings/modules-and-fields/${mid}/layouts/${lid}`, 10000); };
const cap = []; const capOn = () => { const f = r => { const u = r.url(); if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && u.includes('/api/v1/') && !/heartbeat|resolved-batch|presence|\/iam\/auth/.test(u)) cap.push(r.method() + ' ' + u.replace(API, '') + ' ' + (r.postData() || '').slice(0, 400)); }; page.on('request', f); return () => page.off('request', f); };
