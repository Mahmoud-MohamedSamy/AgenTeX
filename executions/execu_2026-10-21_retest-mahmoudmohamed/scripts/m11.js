const labs = await page.locator('button[aria-label*="QA RT partners"], [aria-label*="QA RT partners"]').evaluateAll(es => es.map(e => e.tagName + ' ' + e.getAttribute('aria-label')).slice(0, 8));
const pick = page.locator('[aria-label*="QA RT partners"]').filter({ hasText: 'Not mapped' }).first();
let opts = null;
if (await pick.count()) { await pick.scrollIntoViewIfNeeded(); await pick.click(); await sleep(1500); opts = await page.locator('[role=listbox] [role=option]').allInnerTexts(); if (!opts.length) opts = (await page.locator('[role=listbox], [role=dialog], [data-aw-floating-portal]').allInnerTexts()).map(x => x.slice(0, 400)); await shot('1229-04-picker'); }
return done({ labs, opts });
