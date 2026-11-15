const R = {};
await page.goto(H + '/modules/' + MID + '/records', { waitUntil: 'domcontentloaded' }); await sleep(8000);
await page.getByRole('button', { name: 'List view' }).click(); await sleep(4000);
await page.locator('select').filter({ hasText: 'Standard' }).first().selectOption({ label: 'QA RT18 Layout' }); await sleep(6000);
const rowsQ = page.locator('main tbody tr', { hasText: /QA RT18 (mass2|E6 keep)/ }); const n = await rowsQ.count();
for (let i = 0; i < n; i++) await rowsQ.nth(i).locator('input[type=checkbox]').first().click(); await sleep(1500);
await page.getByRole('button', { name: 'Module actions' }).click(); await sleep(1200); await page.getByRole('menuitem', { name: 'Mass Update' }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').first();
await d.getByText('Choose a field').click(); await sleep(1200);
await page.getByPlaceholder('Search').last().fill('QA RT18'); await sleep(1500);
R.opts = await page.evaluate(() => { const i = [...document.querySelectorAll('input[placeholder=Search]')].pop(); let p = i; for (let k = 0; k < 4 && p; k++) p = p.parentElement; return p ? p.innerText.split(/\n/).slice(0, 25) : null; });
await shot('2974-3-field-list.png');
const o = page.getByText('QA RT18 type', { exact: true }).last(); R.typeOffered = await o.count();
if (R.typeOffered) {
  await o.click(); await sleep(1500); R.afterPick = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500);
  const vcb = d.locator('button[role=combobox]').last(); await vcb.click(); await sleep(800); const ro = page.getByRole('option', { name: 'Refund', exact: true }).first(); if (await ro.count()) { await ro.click(); } else { await page.getByText('Refund', { exact: true }).last().click(); } await sleep(800);
  await shot('2974-4-refund-picked.png'); R.bD = await box(d);
  const resp = page.waitForResponse(r => r.url().includes('mass-update'), { timeout: 20000 }).catch(() => null);
  await d.getByRole('button', { name: 'Update records' }).click(); const rr = await resp; R.status = rr ? rr.status() : null; R.respBody = rr ? (await rr.text().catch(() => '')).slice(0, 500) : null; await sleep(2500);
  R.msgs = await grab(/[^.]{0,60}(cannot be mass updated|primary field|layout rule|updated|failed|error)[^.]{0,120}/gi, 5);
  await shot('2974-5-result.png'); R.bD2 = await box(page.locator('[role=dialog]').first()); R.toast = await box(page.locator('[data-sonner-toast], [role=status]').first());
}
return R;
