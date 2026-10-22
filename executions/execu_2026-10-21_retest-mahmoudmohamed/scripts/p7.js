const adm = page.locator('div').filter({ has: page.locator('[role=img][aria-label="mahmoud.mahamed1515"]') }).last();
await adm.locator('xpath=following-sibling::button[1]').click(); await sleep(2000);
const d = await page.locator('[role=dialog]').allInnerTexts();
await shot('1172-03-admin-picker');
return done({ d: d.map(x => x.slice(0, 900)) });
