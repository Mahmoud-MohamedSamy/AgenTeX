await shot('obs-create-module-plural-required');
await page.locator('[role=dialog]').last().getByRole('button', { name: 'Cancel' }).click().catch(() => {}); await sleep(1000);
await page.getByRole('button', { name: 'Create New Module', exact: true }).click(); await sleep(3000);
const d = await page.locator('[role=dialog]').allInnerTexts();
await shot('1229-01b-create-new-module');
return done({ url: page.url(), d, t: d.length ? '' : (await txt()).split('Storage Requests')[1]?.slice(0, 1200) });
