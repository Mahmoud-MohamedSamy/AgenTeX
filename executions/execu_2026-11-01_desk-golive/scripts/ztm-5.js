async (page) => { const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: new RegExp('^\s*' + item) }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
  const out = {}; await openT(page, '1499272000000451185');
  await more(page, 'Clone'); await page.waitForTimeout(4000); out.url = page.url().slice(-80);
  const t = await body(page); out.status = (t.match(/Status.{0,80}/g) || []).slice(0, 3); out.head = t.slice(0, 300);
  await page.screenshot({ path: '../evidence/zoho-tm/clone-form.png' });
  return out; }
