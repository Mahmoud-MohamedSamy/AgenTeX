await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(1500);
const all = await page.locator('[role=option], [role=listbox] li, [role=menuitem]').allInnerTexts();
await shot('1788-02-field-list');
const srch = page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last();
let found = {}; for (const q of ['Created', 'Modified', 'Priority']) { await srch.fill(q); await sleep(800); found[q] = await page.locator('[role=option], [role=listbox] li, [role=menuitem]').allInnerTexts(); }
await shot('1788-03-search-modified');
await srch.fill(''); await sleep(500);
return done({ all, found });
