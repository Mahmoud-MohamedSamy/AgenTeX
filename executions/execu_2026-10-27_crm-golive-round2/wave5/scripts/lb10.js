const res = {};
await page.locator('text=Remove from Layout').first().click(); await sleep(1500);
if (await page.locator('[role=dialog], [role=alertdialog]').count()) { res.c1 = (await page.locator('[role=dialog], [role=alertdialog]').first().innerText()).replace(/\s+/g, ' ').slice(0, 300); await page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /Remove|Confirm|Yes/ }).first().click().catch(() => {}); await sleep(1000); }
await page.locator('text=Unused Fields').first().click(); await sleep(1200);
const it = page.locator('text=/^Lookup Contacts R2W5$/').first(); const b = await it.boundingBox(); res.unusedBox = b;
await page.mouse.move(b.x + 20, b.y + 5); await sleep(600);
await shot('lb-unused-hover');
const near = []; for (const x of await page.$$('button')) { const bb = await x.boundingBox(); if (bb && Math.abs(bb.y - b.y) < 20 && bb.x > b.x) near.push((await x.getAttribute('aria-label')) || (await x.innerText())); }
res.near = near;
return res;
