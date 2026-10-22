await page.getByRole('button', { name: 'Create New Teamspace' }).click(); await sleep(4000);
const t = (await txt()).split('Storage Requests')[1]?.slice(0, 1500);
const d = await page.locator('[role=dialog]').allInnerTexts();
await shot('1172-02-create-form');
return done({ url: page.url(), d, t: d.length ? '' : t });
