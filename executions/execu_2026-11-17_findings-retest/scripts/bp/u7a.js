const out = {};
await page.goto(H + '/settings/organization/departments', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Customer Support/.test(await text())) break; }
await page.getByPlaceholder('Search departments').fill('QA RT21 BP'); await sleep(3000);
await shot('F07-0-list.png');
const row = page.locator('tr', { hasText: 'QA RT21 BP Dept B' }).first(); out.row = await row.count();
const sw = row.locator('button[role=switch], [role=switch], input[type=checkbox]').first(); out.sw = await sw.count();
await sw.click(); await sleep(2500);
const dlg = page.locator('[role=dialog], [role=alertdialog]').first(); out.dlg = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900);
out.selects = await dlg.locator('select').evaluateAll(es => es.map(e => [...e.options].map(o => o.text).join(' / '))).catch(() => []);
out.combos = await dlg.locator('[role=combobox], button').allInnerTexts().catch(() => []);
await shot('F07-1-disable-dialog.png');
return out;
