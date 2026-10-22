await sleep(1500);
const d = await page.locator('[role=dialog]').allInnerTexts();
if (!d.length) { await page.getByRole('button', { name: 'Create New Module', exact: true }).click(); await sleep(3000); }
const d2 = await page.locator('[role=dialog]').allInnerTexts();
await shot('1229-01b-create-new-module');
return done({ url: page.url(), d2, t: d2.length ? '' : (await txt()).split('Storage Requests')[1]?.slice(0, 1200) });
