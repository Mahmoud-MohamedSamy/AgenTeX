async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const r = await api(page, 'GET', 'tickets?limit=15&sortBy=-createdTime&include=assignee');
out.latest = (r.j && r.j.data || []).filter(x => /QA RT22/.test(x.subject)).map(x => ({ id: x.id, n: x.ticketNumber, subj: x.subject, ownerId: x.assigneeId, owner: x.assignee ? (x.assignee.firstName || '') + ' ' + x.assignee.lastName : null, created: x.createdTime, dept: x.departmentId }));
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/data-administration/import', { waitUntil: 'commit' }).catch(()=>{});
await page.waitForTimeout(6000);
const t = await body(page); const i = t.indexOf('IMPORT ID'); out.list = t.slice(i + 75, i + 260);

return out; }