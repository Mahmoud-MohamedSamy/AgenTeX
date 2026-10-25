await page.getByRole('button', { name: /^AR$|اللغة|language/i }).first().click().catch(async () => page.getByText('AR', { exact: true }).first().click()); await sleep(1000);
await page.getByText('English', { exact: true }).first().click(); await sleep(4000);
return done({ dir: await page.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang) });
