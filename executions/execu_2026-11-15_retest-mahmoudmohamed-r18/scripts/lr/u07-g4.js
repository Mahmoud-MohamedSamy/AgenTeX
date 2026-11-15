const R = {}; const f = x => FP + x;
await openRec(MID, I.massA);
const row = page.locator('div.group', { has: page.getByText('QA RT18 type', { exact: true }) }).first();
await row.scrollIntoViewIfNeeded(); await row.hover(); await row.getByRole('button', { name: 'Edit field' }).click(); await sleep(1500);
const pop = page.locator('div', { has: page.getByRole('button', { name: 'Cancel', exact: true }) }).filter({ has: page.locator('button[role=combobox]') }).last();
await pop.locator('button[role=combobox]').first().click(); await sleep(800); await page.getByRole('option', { name: 'Refund', exact: true }).first().click(); await sleep(1000);
await shot('2975-1-inline-picked.png'); R.b1 = await box(pop);
await pop.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(3500);
const dlg = page.locator('[role=dialog],[role=alertdialog]').first(); R.dlg = await dlg.count(); if (R.dlg) { R.dlgTxt = (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 600); R.dlgInputs = await dlg.locator('input,textarea').count(); R.dlgBtns = await dlg.getByRole('button').allInnerTexts(); }
R.msgs = await grab(/[^.]{0,60}(required|Review|saved|updated)[^.]{0,80}/gi);
await shot('2975-2-after-confirm.png'); R.bDlg = R.dlg ? await box(dlg) : null; R.bPop = await box(pop);
return R;
