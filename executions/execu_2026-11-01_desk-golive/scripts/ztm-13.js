async (page) => { const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: new RegExp('^\s*' + item) }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
  const out = {}; const T = '1499272000000451225';
  await openT(page, T);
  await more(page, 'Share'); await page.waitForTimeout(2500); out.share = (await body(page)).match(/.{0,50}[Ss]hare.{0,400}/g)?.slice(-1)[0]; await page.screenshot({ path: '../evidence/zoho-tm/share-dlg.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
  const c = page.locator('input[type=button][value=Cancel]').filter({ visible: true }); if (await c.count()) await c.last().click().catch(() => {});
  await openT(page, T);
  await more(page, 'Follow'); await page.waitForTimeout(2500); out.followAfter = (await body(page)).match(/.{0,80}(follow|Follow).{0,120}/g)?.slice(0, 3);
  await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); out.menuAfterFollow = (await page.locator('li').evaluateAll(es => es.filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x > 1250).map(e => e.innerText.replace(/\s+/g, ' ').trim()))).slice(0, 14); await page.keyboard.press('Escape');
  await page.screenshot({ path: '../evidence/zoho-tm/follow-after.png' });
  return out; }
