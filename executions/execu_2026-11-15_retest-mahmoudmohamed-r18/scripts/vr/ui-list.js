const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
await page.goto(H + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(8000);
R.rows = (await page.locator('tbody tr').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 200));
R.uuidInRows = R.rows.filter(r => /[0-9a-f]{8}-[0-9a-f]{4}-/.test(r));
await shot('3019-1-list-fresh.png');
// layouts tab
await page.goto(H + '/settings/modules-and-fields/' + MID + '?tab=layouts', { waitUntil: 'domcontentloaded' }); await sleep(7000);
const row = page.locator('tr, [role=row], li, div.group').filter({ hasText: 'QA RT18 J6b Layout' }).last();
R.rowFound = await row.count(); R.rowText = R.rowFound ? (await row.innerText()).replace(/\s+/g, ' ').slice(0, 200) : null;
await shot('3015-1-layouts.png');
return R;
