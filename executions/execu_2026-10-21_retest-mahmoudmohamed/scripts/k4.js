await page.getByText('Audit Log', { exact: true }).first().click(); await sleep(8000);
const btns = await page.locator('main button, [role=combobox], select').evaluateAll(es => es.slice(0, 20).map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || '').slice(0, 40)));
const ent = page.getByRole('button', { name: /All Entities|Entity/i }).first();
let opts = null;
if (await ent.count()) { await ent.click(); await sleep(1500); opts = await page.locator('[role=listbox] [role=option], [role=menu] [role=menuitem], [role=menuitemcheckbox], [role=dialog] label, [data-aw-floating-portal] li, [data-aw-floating-portal] label').allInnerTexts(); await shot('1344-01-entity-filter'); }
return done({ url: page.url(), btns, opts });
