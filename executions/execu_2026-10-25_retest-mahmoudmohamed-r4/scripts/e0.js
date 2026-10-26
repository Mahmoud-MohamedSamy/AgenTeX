await go('/', 10000); await go('/settings', 10000);
const link = page.getByText('Recycle Bin', { exact: true }).first(); const has = await link.count();
if (has) { await link.click(); await sleep(10000); }
await shot('1602-r2-00-page');
return done({ has, url: page.url(), t: (await txt()).slice(0, 1200), btns: await page.locator('button').evaluateAll(b => b.map(x => x.innerText.trim()).filter(Boolean).slice(0, 40)) });
