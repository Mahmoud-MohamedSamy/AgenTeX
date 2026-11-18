await page.goto(H + '/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/new', { waitUntil: 'commit' }); await page.evaluate(() => localStorage.setItem('anyware_language', 'ar')); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(2000); if ((await text()).length > 600) break; } await sleep(3000);
const t = (await text()).replace(/\s+/g, ' '); const out = { t: t.slice(0, 900) };
out.labels = await page.locator('label').allInnerTexts(); await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
return out;
