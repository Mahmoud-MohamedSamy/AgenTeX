await page.getByRole('button', { name: 'Done', exact: true }).first().click({ force: true }).catch(() => {}); await sleep(800); await page.getByRole('button', { name: 'Add condition', exact: true }).first().click({ force: true }); await sleep(1500); await shot('e1-cond-row');
// open the field picker (first combobox/button in the new row)
const cands = page.locator('[role=combobox], button:has-text("Select field"), button:has-text("Choose a field"), button:has-text("Field")');
const n = await cands.count(); let opened = '';
for (let i = 0; i < n; i++) { const c = cands.nth(i); if (!(await c.isVisible())) continue; const t = (await c.innerText()).trim(); if (/field|select/i.test(t) || t === '') { await c.click({ force: true }); await sleep(1500); opened = t; break; } }
await shot('e2-field-picker');
const opts = await page.locator('[role=option], [role=listbox] li, [cmdk-item]').allInnerTexts();
const search = page.locator('input[placeholder*="earch"]').last(); let contactOpts = [];
if (await search.count()) { await search.fill('Contact'); await sleep(1200); contactOpts = await page.locator('[role=option], [cmdk-item]').allInnerTexts(); await shot('e3-search-contact'); await search.fill('Account'); await sleep(1200); contactOpts.push('|ACCOUNT|', ...(await page.locator('[role=option], [cmdk-item]').allInnerTexts())); await search.fill('Execution'); await sleep(1000); contactOpts.push('|EXEC|', ...(await page.locator('[role=option], [cmdk-item]').allInnerTexts())); }
return fin({ opened, n: opts.length, opts: opts.slice(0, 80), contactOpts: contactOpts.slice(0, 60) });
