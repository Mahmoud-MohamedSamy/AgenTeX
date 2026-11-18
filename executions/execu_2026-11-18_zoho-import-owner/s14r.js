async (page) => { 
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: item }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const api = async (page, m, p, b) => page.evaluate(async ([m, p, b]) => { const B = '/supportapi/zd/techegysolutions/api/v1/'; const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(B + p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 300) }; }, [m, p, b]);
const shotZ = (page, n) => page.screenshot({ path: '../evidence/zoho-tm/' + n + '.png' });
const T108 = '1499272000000451185', T109 = '1499272000000451225', T110 = '1499272000000451265';

const out = {};
const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
const setMap = async (row, name) => {
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800); await page.locator('input[data-id="dest_None_textBox"]:visible').first().click();
  await page.waitForTimeout(1500); await page.keyboard.type(name); await page.waitForTimeout(1500);
  const all = await page.locator('li:visible').all(); let n = 0;
  for (const l of all) { const t = (await l.innerText()).split('*').join('').trim(); if (t === name) { await l.click(); n = 1; break; } }
  await page.waitForTimeout(1500); return n; };
const cur = await page.$$eval('input', es => es.filter(e=>e.offsetParent && (e.getAttribute('data-id')||'').indexOf('dest_') === 0).map(e => e.value)); out.before = cur;
if (cur[1] === 'None') out.dep = await setMap(2, 'Department');
out.con = await setMap(4, 'Contact');
out.inp = await page.$$eval('input', es => es.filter(e=>e.offsetParent && (e.getAttribute('data-id')||'').indexOf('dest_') === 0).map(e => e.value));
await page.screenshot({ path: D + 'shots/12-A-mapped.png' });

return out; }