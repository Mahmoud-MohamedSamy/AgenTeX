async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const D = '1499272000000006907';
const s = await api(page, 'GET', 'sla?departmentId=' + D); out.slaStatus = (s.j && s.j.data || []).map(x => x.name + ':' + x.status);
const t = await api(page, 'POST', 'tickets', { subject: 'QA RT22 BPMID Z3 High priority SLA plus blueprint', departmentId: D, contactId: '1499272000000517213', status: 'Open', priority: 'High', channel: 'Phone' });
out.Z3 = { id: t.j && t.j.id, n: t.j && t.j.ticketNumber };
await page.waitForTimeout(15000);
const g = await api(page, 'GET', 'tickets/' + out.Z3.id); const b = await api(page, 'GET', 'tickets/' + out.Z3.id + '/blueprint'); const h = await api(page, 'GET', 'tickets/' + out.Z3.id + '/History?limit=20');
out.Z3.dueDate = g.j && g.j.dueDate; out.Z3.status = g.j && g.j.status; out.Z3.bp = b.s + ' ' + (b.j && b.j.state ? b.j.name + ' / ' + b.j.state.name : b.t.slice(0, 120));
out.Z3.hist = (h.j && h.j.data || []).map(e => (e.actor && (e.actor.type + ':' + e.actor.name)) + ' ' + e.eventName);

return out; }