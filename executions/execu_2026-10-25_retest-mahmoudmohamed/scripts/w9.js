const res = [];
for (let i = 1; i <= 4; i++) {
  await page.reload({ waitUntil: 'commit' });
  let tr = null; for (let k = 0; k < 30; k++) { await sleep(1000); tr = (await page.locator('body').innerText().catch(() => '')).match(/Total Records (\d+)/); if (tr) break; }
  await sleep(1500);
  const rows = (await page.locator('tbody tr').allInnerTexts()).map(r => (r.match(/QA RT wq t\d+/) || ['?'])[0]);
  const badge = await page.locator('button[aria-label^="Filter"]').first().innerText().catch(() => '');
  res.push(`reload ${i}: Total Records ${tr && tr[1]} rows [${rows.join(',')}] badge="${badge.trim()}"`);
}
return done({ res });
