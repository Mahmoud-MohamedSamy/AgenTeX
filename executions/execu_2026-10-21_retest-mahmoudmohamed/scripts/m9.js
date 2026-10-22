const hdr = await page.locator('table thead th').allInnerTexts();
const ci = hdr.findIndex(h => /QA RT partners/.test(h));
const row = page.locator('table tbody tr').filter({ hasText: 'Full Name' }).first();
const cell = row.locator('td').nth(ci);
const ctl = cell.locator('button, select, [role=combobox]').first();
const tag = await ctl.evaluate(e => e.tagName);
let opts;
if (tag === 'SELECT') opts = await ctl.evaluate(s => [...s.options].map(o => o.text));
else { await ctl.click(); await sleep(1200); opts = await page.locator('[role=listbox] [role=option], [role=option]').allInnerTexts(); if (!opts.length) opts = [(await page.locator('[role=dialog],[data-aw-floating-portal]').allInnerTexts()).join('|').slice(0, 500)]; }
await ctl.scrollIntoViewIfNeeded(); await shot('1229-04-picker');
return done({ hdr, ci, tag, opts });
