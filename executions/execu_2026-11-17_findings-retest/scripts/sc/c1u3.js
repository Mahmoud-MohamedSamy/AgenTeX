await page.goto(H + '/settings/company/details', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/Home currency/i.test(await text())) break; }
await sleep(1500);
await page.getByRole('button', { name: 'Edit', exact: true }).first().click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').first();
await dlg.getByText('Egyptian Pound', { exact: true }).first().click(); await sleep(1500);
const opts = await page.locator('[role=option]:visible').allInnerTexts(); log('opts ' + opts.length + ' ' + opts.slice(0, 12).join(' | '));
await shot('C1-4-currency-dropdown-open.png');
await page.keyboard.press('Escape'); await sleep(500);
const v = await dlg.innerText().catch(() => ''); log('stillEGP ' + /Egyptian Pound/.test(v));
const cancel = dlg.getByRole('button', { name: /Cancel/i }).first(); if (await cancel.count()) await cancel.click(); else await page.keyboard.press('Escape');
await sleep(1000); log('closed ' + !(await page.locator('[role=dialog]').count()));
