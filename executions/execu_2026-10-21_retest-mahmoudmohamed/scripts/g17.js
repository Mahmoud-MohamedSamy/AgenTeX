await page.getByRole('button', { name: 'Import history' }).first().click().catch(async () => await page.getByText('Import history').first().click()); await sleep(6000);
const url = page.url();
const t = (await txt()).split('Meetings')[1]?.slice(0, 1200);
await shot('1589-01-history');
const row = page.locator('tr').filter({ hasText: 'QA-RT-leads-imp.xlsx' }).first();
const n = await row.count();
let menu = null;
if (n) { await row.locator('button').last().click(); await sleep(1200); menu = await page.locator('[role=menu]').allInnerTexts(); await shot('1589-02-row-menu'); }
return done({ url, t, n, menu });
