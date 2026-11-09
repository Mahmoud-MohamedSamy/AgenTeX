await page.locator('text=My Leads').first().click(); await sleep(7000);
await page.screenshot({ path: RAW + 'z-wq-myleads.png' });
const th = page.locator('text=Lead Name').first(); await th.hover().catch(() => {}); await sleep(800);
const menuIcon = page.locator('[class*="colMenu" i], [class*="column-menu" i], [data-zcqa*="colmenu" i], [aria-label*="column" i]').first();
out.menuIcons = await menuIcon.count();
const box = await th.boundingBox().catch(() => null); out.thBox = box;
if (box) { await page.mouse.move(box.x + box.width + 60, box.y + box.height / 2); await sleep(600); }
await page.screenshot({ path: RAW + 'z-wq-header-hover.png' });
// Filter panel
await page.locator('text=Filter').first().click().catch(e => out.fErr = String(e.message).slice(0, 60)); await sleep(2500);
out.filterText = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,50}(System Defined Filters|Filter By Fields).{0,500}/)?.[0];
await page.screenshot({ path: RAW + 'z-wq-filter.png' });
await page.keyboard.press('Escape');
