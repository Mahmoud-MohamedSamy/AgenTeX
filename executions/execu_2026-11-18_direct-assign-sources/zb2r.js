async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const D = '1499272000000006907';
const c = await api(page, 'POST', 'contacts', { lastName: 'QA RT22 BPMID', email: 'qa-rt22-bpmid@example.com' }); out.contact = c.j && c.j.id;
const mk = async (subject, status) => { const t = await api(page, 'POST', 'tickets', { subject, departmentId: D, contactId: out.contact, status, channel: 'Phone' }); return { s: t.s, id: t.j && t.j.id, n: t.j && t.j.ticketNumber, status: t.j && t.j.status, err: t.s >= 300 ? t.t.slice(0, 200) : undefined }; };
out.Z1 = await mk('QA RT22 BPMID Z1 created Open', 'Open');
out.Z2 = await mk('QA RT22 BPMID Z2 created Escalated', 'Escalated');
await page.waitForTimeout(15000);
for (const k of ['Z1', 'Z2']) { if (!out[k].id) continue; const g = await api(page, 'GET', 'tickets/' + out[k].id); const b = await api(page, 'GET', 'tickets/' + out[k].id + '/blueprint'); out[k].now = g.j && g.j.status; out[k].bp = b.s + ' ' + (b.j && b.j.currentState ? b.j.currentState.name + ':' + b.j.currentState.type : b.t.slice(0, 150)); }
require('fs').writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/zbp.json', JSON.stringify(out, null, 1));

return out; }