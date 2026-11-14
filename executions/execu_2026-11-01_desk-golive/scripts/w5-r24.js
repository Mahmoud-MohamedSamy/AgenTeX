await go('/profile', 10000);
await page.getByRole('tab', { name: /Account information/ }).click().catch(async () => await page.getByText('Account information', { exact: true }).click()); await sleep(4000);
let t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('Account information'); out.acct = t.slice(i, i + 900); await shot('w5/W5-71-account');
await page.getByRole('button', { name: 'Open profile' }).click(); await sleep(1500); await page.getByText('Default settings', { exact: true }).click(); await sleep(6000);
t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.defUrl = page.url().replace(H, ''); out.def = t.slice(t.search(/Default settings|Time zone|Language/), t.search(/Default settings|Time zone|Language/) + 900); await shot('w5/W5-71-defaults');
return fin({ out });
