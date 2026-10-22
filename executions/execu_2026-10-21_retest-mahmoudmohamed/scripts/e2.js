await page.getByRole('button', { name: 'Next' }).click(); await sleep(5000);
const t = (await txt()).split('Result')[1]?.slice(0, 2000);
await shot('1519-01-operation-deals');
return done({ t });
