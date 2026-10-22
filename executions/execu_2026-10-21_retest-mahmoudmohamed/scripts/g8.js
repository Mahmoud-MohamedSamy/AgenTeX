await go('/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3', 10000);
const t0 = (await txt()).slice(0, 200);
await page.mouse.click(1101, 97); await sleep(1500);
const menu = await page.locator('[role=menu]').allInnerTexts();
const it = page.getByRole('menuitem', { name: /Import Leads/ }); if (await it.count()) { await it.click(); await sleep(6000); }
return done({ t0, menu, url: page.url(), t: (await txt()).slice(0, 600) });
