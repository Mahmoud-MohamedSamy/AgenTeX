async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const c = await api(page, 'POST', 'contacts', { lastName: 'QA RT22 Import', email: 'qa-rt22-import@example.com' }); out.contact = { s: c.s, id: c.j && c.j.id };
const ag = await api(page, 'GET', 'agents?limit=50&status=ACTIVE'); const a1 = ag.j.data.find(a => a.name === 'test agent 1');
const a1d = await api(page, 'GET', 'agents/' + a1.id); out.a1depts = a1d.j && a1d.j.associatedDepartmentIds;
const deps = await api(page, 'GET', 'departments?isEnabled=true'); out.depts = (deps.j.data || []).map(d => d.name + ' ' + d.id);
const fs = require('fs'); const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/data/';
fs.mkdirSync(D + 'C', { recursive: true });
fs.writeFileSync(D + 'C/Tickets.csv', 'Subject,Department,Status,Email,Ticket Owner\r\n'
 + 'QA RT22 IMP C1 unknown email,Tech,Open,qa-rt22-import@example.com,qa-rt22-nobody@example.com\r\n'
 + 'QA RT22 IMP C2 agent1 not in Tech,Tech,Open,qa-rt22-import@example.com,' + a1.emailId + '\r\n'
 + 'QA RT22 IMP C3 agent name not email,Tech,Open,qa-rt22-import@example.com,test agent 2\r\n');
out.written = true;

return out; }