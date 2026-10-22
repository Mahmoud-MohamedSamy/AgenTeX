const row = page.locator('tr').filter({ hasText: 'QA-RT-leads-imp.xlsx' }).first();
await row.locator('button').last().click(); await sleep(1000);
await page.getByRole('menuitem', { name: 'View details' }).click(); await sleep(4000);
const d = await page.locator('[role=dialog]').allInnerTexts();
await shot('1589-03-view-details');
return done({ url: page.url(), d: d.map(x => x.slice(0, 1500)), t: d.length ? '' : (await txt()).split('Meetings')[1]?.slice(0, 1200) });
