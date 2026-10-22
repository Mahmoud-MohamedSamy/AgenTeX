await page.keyboard.press('Escape'); await sleep(500);
const row = page.locator('tbody tr').filter({ hasText: 'nameb56175' }).first();
await row.scrollIntoViewIfNeeded(); await page.evaluate(() => { const s = document.querySelector('div.flex-1.min-w-0.min-h-0.overflow-y-auto'); if (s) s.scrollTop += 120; }); await sleep(800);
const bb = await row.boundingBox();
await shot('1422-02-phone-row');
return done({ bb, row: await row.innerText() });
