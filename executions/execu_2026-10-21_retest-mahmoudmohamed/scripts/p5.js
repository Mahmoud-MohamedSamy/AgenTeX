await page.getByPlaceholder('Untitled Teamspace').fill('QA RT 1172'); await sleep(400);
// admin
await page.locator('button').filter({ hasText: 'mahmoud.mahamed1515' }).first().click(); await sleep(1200);
const adminOpts = await page.locator('[role=listbox] [role=option], [role=option]').allInnerTexts();
const o = page.locator('[role=option]').filter({ hasText: 'ndc-staging-owner' }).first(); if (await o.count()) { await o.click(); await sleep(800); }
await page.keyboard.press('Escape'); await sleep(400);
const adminNow = (await txt()).match(/Admin\n[\s\S]{0,60}/)?.[0];
// selected users
await page.getByText('Selected Users', { exact: true }).click(); await sleep(2000);
const d = await page.locator('[role=dialog]').allInnerTexts();
await shot('1172-03-selected-users');
return done({ adminOpts: adminOpts.slice(0, 20), adminNow, d: d.map(x => x.slice(0, 800)) });
