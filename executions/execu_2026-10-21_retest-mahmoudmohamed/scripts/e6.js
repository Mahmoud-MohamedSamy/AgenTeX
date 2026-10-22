await page.getByRole('button', { name: 'Save & next' }).click(); await sleep(8000);
const t = (await txt()).split('Result')[1]?.slice(0, 2500);
await shot('1323-04-review');
return done({ t });
