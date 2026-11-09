const o = {}; await page.keyboard.press('Escape'); await sleep(800);
const row = page.locator('text=/^QA NDC Agent id$/').first(); if (await row.count()) { await row.hover().catch(() => {}); await sleep(800); }
const dots = page.locator('button[aria-label*="ore"], button[aria-label*="ptions"], button:has-text("…"), button:has-text("...")').filter({ hasNot: page.locator('svg[class*="never"]') });
const box = row.count ? await row.boundingBox().catch(() => null) : null;
let clicked = false; const n = await dots.count();
for (let i = 0; i < n && !clicked; i++) { const b = await dots.nth(i).boundingBox().catch(() => null); if (b && box && Math.abs(b.y - box.y) < 40) { await dots.nth(i).click().catch(() => {}); clicked = true; } }
if (!clicked && box) { await page.mouse.click(box.x + 535, box.y + 8); }
await sleep(1500); o.menu = await page.$$eval('[role=menuitem], [role=menu] *, [role=dialog] label, [role=dialog] button', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(Boolean))].slice(0, 25));
o.shot = await shot('a6/tavi-layout-field-menu');
return JSON.stringify(o);
