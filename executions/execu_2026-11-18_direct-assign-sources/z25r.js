async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const D = '1499272000000006907', A2 = '1499272000000432034';
let b = { name: 'QA RT22 WF owner on create', module: 'tickets', departmentId: D, executeOn: ['CREATE'], status: 'ACTIVE', description: 'QA',
  criteria: { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: 'starts with', value: ['QA RT22 WF'] }], pattern: '1' },
  actions: { fieldUpdates: [{ fieldName: 'Ticket Owner', value: A2 }] } };
out.r = [];
for (let k = 0; k < 8; k++) { const r = await api(page, 'POST', 'workflows?module=tickets&departmentId=' + D, b); out.r.push(r.s + ' ' + r.t.slice(0, 260)); if (r.s < 300) { out.ok = r.t.slice(0, 600); break; }
  const m = (r.t.match(/extra parameter '([^']+)'/) || [])[1]; if (m) { const strip = o => { if (Array.isArray(o)) return o.map(strip); if (o && typeof o === 'object') { const c = {}; for (const [kk, v] of Object.entries(o)) if (kk !== m) c[kk] = strip(v); return c; } return o; }; b = strip(b); continue; } break; }

return out; }