const rows = page.locator('table tbody tr'); const n = await rows.count(); const after = [];
for (let i = 0; i < n; i++) { const r = rows.nth(i); const col = (await r.locator('td').first().innerText()).trim(); const s = r.locator('select').first();
  if (['Pipeline', 'Stage', 'Amount', 'Deal name'].includes(col)) await s.selectOption({ label: col });
  after.push(col + '→' + await s.evaluate(x => x.options[x.selectedIndex].text)); }
await sleep(800);
await shot('1323-02-mapped');
await page.getByRole('button', { name: 'Next' }).click(); await sleep(6000);
const t = (await txt()).split('Result')[1]?.slice(0, 2000);
await shot('1323-03-assign');
return done({ after, t });
