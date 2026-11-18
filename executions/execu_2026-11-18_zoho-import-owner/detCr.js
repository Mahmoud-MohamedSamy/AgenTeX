async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const IMP='1499272000000517038';
const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.locator('[data-title="' + IMP + '"]').first().click({ force: true }); await page.waitForTimeout(8000);
await page.screenshot({ path: D + 'shots/' + IMP + '-detail.png' });
const t = await body(page); const i = t.indexOf('IMPORT DETAIL VIEW'); out.detail = t.slice(i, i + 600);
out.clickables = await page.$$eval('a, button, [data-id]', es => es.filter(e => e.offsetParent && /fail|error|download|log|skip/i.test((e.innerText || '') + ' ' + (e.getAttribute('data-id') || '') + ' ' + (e.getAttribute('data-title') || ''))).map(e => (e.tagName + ' ' + (e.getAttribute('data-id') || '') + ' ' + (e.innerText || '').trim()).slice(0, 80))).catch(() => []);
const dl = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
const f = page.locator('[data-title="' + IMP + '"]').locator('xpath=ancestor::body').locator('text=/^1$/').last();

return out; }