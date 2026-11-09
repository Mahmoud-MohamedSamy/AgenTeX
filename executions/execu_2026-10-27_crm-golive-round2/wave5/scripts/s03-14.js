const res = {};
await page.mouse.click(893, 209); await sleep(1200);
res.menu = await page.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).join(' || '));
await shot('s03-widget-menu');
const u = page.locator('[role=menuitem]', { hasText: 'underlying' }).first();
if (await u.count()) { await u.click(); await sleep(7000); res.url = page.url().replace(H, ''); res.text = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 500); await shot('s03-underlying'); }
return res;
