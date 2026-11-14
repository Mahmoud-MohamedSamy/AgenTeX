await go('/hq', 8000);
await page.getByRole('button', { name: /^AR$/ }).first().click(); await sleep(1500);
await page.getByRole('menuitemradio', { name: /English/ }).first().click().catch(async () => await page.getByText('English').first().click()); await sleep(5000);
out.dir = await page.evaluate(() => document.documentElement.dir + ' ' + document.documentElement.lang);
return fin({ out });
