async (page) => { const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: new RegExp('^\s*' + item) }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
  const api = async (m, p, b) => page.evaluate(async ([m, p, b]) => { const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]; const r = await fetch(B+p,{method:m,headers:{'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','content-type':'application/json'},body:b?JSON.stringify(b):undefined}); const t = await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,300)}; }, [m, p, b]);
  const out = {}; await page.keyboard.press('Escape');
  const me = await api('GET', 'myinfo'); out.me = me.j && [me.j.id, me.j.firstName]; 
  const as = await api('PATCH', 'tickets/1499272000000451185', { assigneeId: me.j.id }); out.assign = as.s;
  await openT(page, '1499272000000451185');
  await more(page, 'Move'); await page.waitForTimeout(4000);
  out.sub = (await page.locator('li').evaluateAll(es => es.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.x > 1250 && r.y > 100; }).map(e => e.innerText.trim()))).slice(0, 10);
  await page.screenshot({ path: '../evidence/zoho-tm/move-sub.png' });
  await page.locator('li').filter({ hasText: /^\s*Tech\s*$/ }).first().click(); await page.waitForTimeout(4000);
  out.after = (await body(page)).slice(0, 600); await page.screenshot({ path: '../evidence/zoho-tm/move-after.png' });
  const t = await api('GET', 'tickets/1499272000000451185'); out.t = t.j && { dept: t.j.departmentId, assignee: t.j.assigneeId, status: t.j.status };
  return out; }
