await page.getByRole('button', { name: /^AR/ }).first().click(); await sleep(1000);
await page.locator('[role=menuitem],[role=option],[role=menuitemradio],button').filter({ hasText: 'English' }).first().click({ force: true }); await sleep(6000);
await go('/settings/modules-and-fields', 8000);
return done({ dir: await page.evaluate(() => document.documentElement.dir + ' ' + document.documentElement.lang) });
