const sel = await page.locator('tbody input[type=checkbox]:checked').count();
await page.getByRole('button', { name: 'Module actions' }).click(); await sleep(1000);
const items = await page.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].map(e => e.innerText.trim()));
await shot('1316-02-actions');
return done({ sel, items });
