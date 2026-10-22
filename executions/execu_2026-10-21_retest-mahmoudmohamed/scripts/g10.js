await page.getByRole('button', { name: 'Module actions' }).click(); await sleep(1200);
const menu = await page.locator('[role=menu]').allInnerTexts();
await page.getByRole('menuitem', { name: /Import Leads/ }).click(); await sleep(8000);
return done({ menu, url: page.url(), t: (await txt()).split('Meetings')[1]?.slice(0, 600) });
