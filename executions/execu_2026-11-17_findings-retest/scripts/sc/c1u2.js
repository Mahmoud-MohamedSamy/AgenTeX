await page.goto(H + '/settings/company/details', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/Home currency/i.test(await text())) break; }
await sleep(1500);
await page.getByRole('button', { name: 'Edit', exact: true }).first().click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').first(); const dt = (await dlg.innerText().catch(() => '')); log('DLG ' + dt.replace(/\n/g, ' | ').slice(0, 2000));
const c = dlg.getByText(/Currency/).first(); if (await c.count()) { await c.scrollIntoViewIfNeeded().catch(() => {}); await sleep(600); log('curBox ' + JSON.stringify(await c.boundingBox())); }
await shot('C1-3-edit-dialog.png');
// is the currency control disabled?
const ctrls = await dlg.locator('input, button[role=combobox], select, [role=combobox]').evaluateAll(es => es.map(e => [e.tagName, e.getAttribute('name') || e.getAttribute('aria-label') || e.id, e.disabled || e.getAttribute('aria-disabled'), (e.value || e.innerText || '').slice(0, 30)]));
log('CTRLS ' + JSON.stringify(ctrls));
const cancel = dlg.getByRole('button', { name: /Cancel/i }).first(); if (await cancel.count()) await cancel.click(); else await page.keyboard.press('Escape');
await sleep(1000); log('closed ' + !(await page.locator('[role=dialog]').count()));
