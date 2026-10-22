await page.getByText('percent_8_9', { exact: true }).last().click(); await sleep(800);
const ta = page.locator('textarea').last(); const val = await ta.inputValue().catch(() => null);
await shot('1586-02-insert-field');
await page.getByRole('button', { name: 'Cancel', exact: true }).last().click(); await sleep(1200);
// discard the layout draft
await page.getByRole('button', { name: 'Cancel', exact: true }).first().click(); await sleep(1500);
const d = await page.locator('[role=dialog],[role=alertdialog]').allInnerTexts();
if (d.length) { const b = page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button', { name: /Discard|Leave|Yes/i }).first(); if (await b.count()) await b.click(); await sleep(1500); }
return done({ expr: val, discardDialog: d, url: page.url() });
