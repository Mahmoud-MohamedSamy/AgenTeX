const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.getByText('Add new records', { exact: true }).click(); await sleep(800);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(6000);
const rows = page.locator('table tbody tr'); const n = await rows.count(); const m = [];
const MAP = { Name: 'Name', 'Single Line': 'Single Line Permission', Percent: 'Percent Permission' };
for (let i = 0; i < n; i++) { const r = rows.nth(i); const col = (await r.locator('td').first().innerText()).replace(/\s*\*$/, '').trim(); const s = r.locator('select').first(); if (MAP[col]) await s.selectOption({ label: MAP[col] }); m.push(col + '→' + await s.evaluate(x => x.options[x.selectedIndex].text) + ' | sample ' + (await r.locator('td').last().innerText()).trim()); }
await shot('1517-03-csv-mapped');
await page.getByRole('button', { name: 'Next' }).click(); await sleep(5000);
await page.getByRole('button', { name: 'Save & next' }).click(); await sleep(7000);
const rev = (await txt()).match(/Rows that will import[\s\S]{0,120}/)?.[0];
await page.getByText('I confirm I have permission', { exact: false }).click(); await sleep(400);
await page.getByRole('button', { name: 'Submit' }).click();
for (let i = 0; i < 60 && !/Import complete|completed with errors|Import failed/i.test(await txt()); i++) await sleep(1500);
const res = (await txt()).match(/Import complete[\s\S]{0,120}/)?.[0];
await shot('1517-04-csv-result');
return done({ m, rev, res });
