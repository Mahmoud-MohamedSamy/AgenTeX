await page.locator('[role=dialog] button[aria-haspopup=listbox]').first().click(); await sleep(1500);
const all = await page.locator('[role=listbox] [role=option]').allInnerTexts();
await shot('1316-03-fieldlist');
await page.keyboard.type('pipe'); await sleep(1200);
const filt = await page.locator('[role=listbox] [role=option]').allInnerTexts();
await shot('1316-04-search-pipe');
return done({ all, filt });
