await page.reload({ waitUntil: 'commit' }); await sleep(3000);
await page.evaluate(() => {}).catch(() => {});
await sleep(9000);
const onLayout = await page.locator('main').getByText('QA RT rollup', { exact: true }).count();
const unused = page.getByText(/^Unused Fields/).first(); if (await unused.count()) { await unused.click(); await sleep(1500); }
const inUnused = await page.getByText('QA RT rollup', { exact: true }).count();
await shot('1444-08-reloaded');
return done({ onLayout, inUnused, url: page.url() });
