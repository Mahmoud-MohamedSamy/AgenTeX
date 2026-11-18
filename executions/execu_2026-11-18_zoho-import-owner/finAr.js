async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const TAG='A2';
const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.mouse.click(741, 220); await page.waitForTimeout(1500);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
out.dest = await page.$$eval('input', es => es.filter(e => e.offsetParent && /^dest_/.test(e.getAttribute('data-id') || '') && /_textBox$/.test(e.getAttribute('data-id'))).map(e => e.value));
await page.screenshot({ path: D + 'shots/' + TAG + '-mapping.png', fullPage: true });
await page.locator('[data-id="mapModule"]').first().click(); await page.waitForTimeout(6000);
await page.locator('button:visible').filter({ hasText: /^Next$/ }).first().click({ timeout: 15000 }).catch(e => out.nextErr = 'no Next'); await page.waitForTimeout(8000);
await page.screenshot({ path: D + 'shots/' + TAG + '-review.png' });
const b = page.locator('button:visible').filter({ hasText: /^Start Import$/ }).first(); const bb = await b.boundingBox().catch(() => null);
if (bb) await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); else out.noStart = 1;
await page.waitForTimeout(30000);
await page.screenshot({ path: D + 'shots/' + TAG + '-after.png' });
const t = await body(page); const i = t.indexOf('IMPORT ID'); out.list = t.slice(i, i + 300);

return out; }