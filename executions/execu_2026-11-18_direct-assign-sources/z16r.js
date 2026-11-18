async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
out.ruleDel = (await api(page, 'DELETE', 'directAssignmentRules/1499272000000517205')).s;
const tk = ['1499272000000541001', '1499272000000537038'];
out.t = (await api(page, 'POST', 'tickets/moveToTrash', { ticketIds: tk })).s;
const cs = await api(page, 'GET', 'contacts/search?email=qa-rt22-import@example.com'); out.qaContact = cs.s;
await page.waitForTimeout(5000);
const rb = await api(page, 'GET', 'recycleBin?limit=100');
const items = (rb.j && rb.j.data || []).filter(x => tk.includes(String(x.id)) || /QA RT22/.test(JSON.stringify(x)));
out.found = items.length; if (items.length) out.purge = (await api(page, 'POST', 'recycleBin/delete', { ids: items.map(x => x.id) })).s;
await page.waitForTimeout(3000);
const rb2 = await api(page, 'GET', 'recycleBin?limit=100'); out.binLeft = (rb2.j && rb2.j.data || []).filter(x => /QA RT22/.test(JSON.stringify(x))).length;
out.rulesLeft = ((await api(page, 'GET', 'directAssignmentRules?limit=20')).j?.data || []).length;
out.exec = (await api(page, 'GET', 'directAssignmentRules/executionStatus')).j;

return out; }