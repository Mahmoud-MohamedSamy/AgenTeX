await page.keyboard.press('Escape'); await sleep(500);
const pick = async (i, name) => { const b = page.getByRole('button', { name: 'Criteria field' }).nth(i); await b.click(); await sleep(1000); const id = await b.getAttribute('aria-controls'); await page.locator(`#${id}`).getByText(name, { exact: true }).first().click(); await sleep(1500); };
await pick(0, 'Lookup Permission');
const mb = page.getByRole('button', { name: 'Module to pick a record from for Lookup Permission' }); await mb.click(); await sleep(1000);
const mods = await page.evaluate(() => [...document.querySelectorAll('[role=option], [role=menuitemradio], [role=menuitem]')].map(e => e.innerText.trim()).slice(0, 20));
await shot('2101-02-module-picker');
return done({ mods });
