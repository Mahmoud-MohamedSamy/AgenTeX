async (page) => { const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: new RegExp('^\s*' + item) }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
  const api = async (m, p, b) => page.evaluate(async ([m, p, b]) => { const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]; const r = await fetch(B+p,{method:m,headers:{'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','content-type':'application/json'},body:b?JSON.stringify(b):undefined}); const t = await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,300)}; }, [m, p, b]);
  const out = {};
  const mv = page.locator('input[value="Move"],button').filter({ hasText: /^Move$/ }); const mi = page.locator('input[type=button][value="Move"]');
  if (await mi.count()) await mi.last().click(); else await mv.last().click(); await page.waitForTimeout(5000);
  await page.screenshot({ path: '../evidence/zoho-tm/move-after.png' });
  const t = await api('GET', 'tickets/1499272000000451185'); out.t = t.j && { dept: t.j.departmentId, assignee: t.j.assigneeId, status: t.j.status };
  out.page = (await body(page)).slice(0, 300); return out; }
