async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
await page.waitForTimeout(25000);
const TE = '1499272000000006907', TC = '1499272000000432293';
const m1 = await api(page, 'POST', 'tickets/1499272000000451889/move', { departmentId: TC }); out.moveZ8 = m1.s + ' ' + m1.t.slice(0, 120);
const m2 = await api(page, 'POST', 'tickets/1499272000000451682/move', { departmentId: TE }); out.moveZ3 = m2.s + ' ' + m2.t.slice(0, 120);
const t3 = (await api(page, 'GET', 'tickets/1499272000000451682')).j; out.z3 = { dept: t3.departmentId, status: t3.status, owner: t3.assigneeId, shared: JSON.stringify(t3.sharedDepartments) };

return out; }