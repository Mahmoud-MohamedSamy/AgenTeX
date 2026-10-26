// NDC-1324: Deals list → inline edit Pipeline on a QA RT deal.
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.getByRole('button', { name: 'Cancel' }).click().catch(() => {}); await sleep(500);
await page.goto(H + `/modules/${D}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/\d+ records/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const lv = page.getByRole('button', { name: 'List view' }); if (await lv.count()) { await lv.click(); await sleep(3000); }
const hdrs = await page.evaluate(() => [...document.querySelectorAll('thead th')].map(t => t.innerText.trim()).filter(Boolean));
const row = page.locator('tbody tr').filter({ hasText: 'QA RT 1302 move' }).first(); const has = await row.count();
await shot('1324-01-list');
return done({ hdrs, has, count: ((await txt()).match(/\d+ records/) || [])[0] });
