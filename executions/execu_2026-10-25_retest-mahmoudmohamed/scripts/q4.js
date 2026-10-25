await page.getByRole('button', { name: 'Next', exact: true }).click(); await sleep(2500);
const panel = page.getByText(/Categorization/i).first();
const t = (await txt()).match(/Categoriz[\s\S]{0,900}/)?.[0];
await shot('1837-04-step2');
return done({ t });
