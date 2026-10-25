const out = { menus: {} };
const heads = await page.locator('thead th').evaluateAll(es => es.map((e, i) => i + ':' + (e.innerText.trim() || '[blank]') + ':' + e.querySelectorAll('button').length + 'btn'));
out.heads = heads;
const cols = await page.getByRole('button', { name: /^Column options: / }).evaluateAll(es => es.map(e => e.getAttribute('aria-label')));
for (const c of cols) { await page.getByRole('button', { name: c, exact: true }).click(); await sleep(900); out.menus[c.replace('Column options: ', '')] = (await page.locator('[role=menu]').allInnerTexts()).join('|').replace(/\n/g, ', '); await page.keyboard.press('Escape'); await sleep(400); }
// row action menu
await page.getByRole('button', { name: 'Row actions' }).first().click(); await sleep(900); out.rowMenu = (await page.locator('[role=menu]').allInnerTexts()).join('|').replace(/\n/g, ', '); await shot('1819-03-row-menu'); await page.keyboard.press('Escape');
return done(out);
