const badgeRow = async () => (await page.locator('tr').filter({ has: page.getByText('Default', { exact: true }) }).allInnerTexts()).map(x => x.split('\n')[0]);
await sleep(5000); const a = await badgeRow(); await shot('1588-07-stale-after-restore');
await page.reload({ waitUntil: 'commit' }); for (let i = 0; i < 20 && !(await page.getByRole('button', { name: /Open menu for/ }).count()); i++) await sleep(1000); await sleep(1500);
const b = await badgeRow();
return done({ after5s: a, afterReload: b });
