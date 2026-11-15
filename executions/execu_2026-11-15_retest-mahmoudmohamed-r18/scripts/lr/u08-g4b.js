const R = {}; const f = x => FP + x;
await openRec(MID, I.massA);
const row = page.locator('div.group', { has: page.getByText('QA RT18 type', { exact: true }) }).first();
await row.scrollIntoViewIfNeeded(); await row.hover(); await row.getByRole('button', { name: 'Edit field' }).click(); await sleep(1500);
const pop = page.locator('div', { has: page.getByRole('button', { name: 'Cancel', exact: true }) }).filter({ has: page.locator('button[role=combobox]') }).last();
await pop.locator('button[role=combobox]').first().click(); await sleep(800); await page.getByRole('option', { name: 'Refund', exact: true }).first().click(); await sleep(1000);
await pop.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(3500);
const dlg = page.locator('[role=dialog]', { hasText: 'Review details' }).first();
// Save with the field empty first
await dlg.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(1500); R.emptySave = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await dlg.locator('input').first().fill('QA RT18 G4 order'); await shot('2975-3-review-filled.png'); R.bDlg = await box(dlg);
const resp = page.waitForResponse(r => r.url().includes('/records/' + I.massA) && r.request().method() === 'PATCH', { timeout: 20000 }).catch(() => null);
await dlg.getByRole('button', { name: 'Save', exact: true }).click(); const rr = await resp; R.patch = rr ? rr.status() : null; await sleep(4000);
R.dlgGone = !(await page.locator('[role=dialog]', { hasText: 'Review details' }).count());
const g = JSON.parse((await api('GET', '/modules/' + MID + '/records/' + I.massA)).t).data.data; const v = n => (g.find(x => x.field === n) || {}).value; R.after = { type: v(f('type')), order: v(f('order')) };
await row.scrollIntoViewIfNeeded(); await shot('2975-4-saved.png'); R.bRow = await box(row);
return R;
