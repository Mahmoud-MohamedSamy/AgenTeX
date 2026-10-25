const res = [];
for (let i = 1; i <= 4; i++) {
  await page.reload({ waitUntil: 'commit' }); await sleep(9000);
  for (let k = 0; k < 10 && !(await page.locator('tbody tr').count()); k++) await sleep(1000);
  const rows = (await page.locator('tbody tr').allInnerTexts()).map(r => (r.match(/QA RT wq t\d+/) || ['?'])[0]);
  const filterBtn = await page.getByRole('button', { name: /^Filter/ }).first().innerText().catch(() => '');
  const chip = /Priority/.test((await txt()).split('Refresh')[1]?.slice(0, 400) || '');
  res.push(`reload ${i}: ${rows.length} rows [${rows.join(',')}] filterButton="${filterBtn.replace(/\n/g, ' ')}" priorityChip=${chip}`);
  if (i === 1) await shot('1789-01-after-reload1');
}
await shot('1789-02-after-reload4');
// priority labels in grid
const cells = await page.locator('tbody tr').first().innerText();
return done({ res, firstRow: cells.replace(/\n/g, ' | ') });
