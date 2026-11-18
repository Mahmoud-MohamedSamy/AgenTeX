async (page) => { const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: new RegExp('^\s*' + item) }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
  const out = {}; await page.keyboard.press('Escape'); await openT(page, '1499272000000451185');
  await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500);
  await page.locator('li').filter({ hasText: /^\s*Move/ }).first().click(); 
  for (let i = 0; i < 15; i++) { await page.waitForTimeout(1500); const s = await page.locator('li').evaluateAll(es => es.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.x > 1250 && r.y > 100; }).map(e => e.innerText.trim())); if (s.some(x => /^Tech$/.test(x))) { out.sub = s; break; } out.sub = s; }
  await page.screenshot({ path: '../evidence/zoho-tm/move-sub.png' });
  return out; }
