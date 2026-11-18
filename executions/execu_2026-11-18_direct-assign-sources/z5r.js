async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const c = await api(page, 'POST', 'contacts', { lastName: 'QA RT22 Import', email: 'qa-rt22-import@example.com' }); out.contact = c.j && c.j.id;
const t = await api(page, 'POST', 'tickets', { subject: 'QA RT22 DA manual create (API)', departmentId: '1499272000000006907', contactId: out.contact, status: 'Open', channel: 'Phone' });
out.ticket = { s: t.s, id: t.j && t.j.id, n: t.j && t.j.ticketNumber, ownerAtCreate: t.j && t.j.assigneeId };
await page.waitForTimeout(15000);
const g = await api(page, 'GET', 'tickets/' + out.ticket.id + '?include=assignee'); out.after = { owner: g.j && g.j.assignee && (g.j.assignee.firstName + ' ' + g.j.assignee.lastName), id: g.j && g.j.assigneeId };
const fs = require('fs'); const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/data/';
fs.mkdirSync(D + 'Z', { recursive: true });
fs.writeFileSync(D + 'Z/Tickets.csv', 'Subject,Department,Status,Email\r\nQA RT22 DA import no owner,TechEgySolutions,Open,qa-rt22-import@example.com\r\n');
fs.writeFileSync(D + '../out/zoho-ids.json', JSON.stringify({ rule: '1499272000000517100', contact: out.contact, manual: out.ticket.id }));

return out; }