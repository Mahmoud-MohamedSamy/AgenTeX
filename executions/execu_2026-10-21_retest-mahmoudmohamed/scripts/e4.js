await page.getByText('Add new records', { exact: true }).click(); await sleep(800);
await page.locator('select').first().selectOption({ label: 'Standard' }); await sleep(800);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(6000);
const t = (await txt()).split('Result')[1]?.slice(0, 2500);
await shot('1323-01-mapping');
return done({ t });
