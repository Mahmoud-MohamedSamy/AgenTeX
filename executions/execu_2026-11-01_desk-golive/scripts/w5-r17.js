await go('/analytics/reports/view/efa2c92a-7145-4b79-85e8-1de588d04ff0', 9000);
await page.getByRole('button', { name: 'Export', exact: true }).click(); await sleep(1500);
out.expMenu = (await page.locator('[role=menu], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-27-export-menu');
const csv = page.getByRole('menuitem', { name: /CSV/i }).first();
if (await csv.count()) { const dl = page.waitForEvent('download', { timeout: 30000 }).catch(() => null); await csv.click(); await sleep(2000);
  const dd = page.locator('[role=dialog]').last(); if (await dd.count()) { out.csvDlg = (await dd.innerText()).replace(/\s+/g, ' ').slice(0, 300); const b = dd.getByRole('button', { name: /Export|Download/i }).last(); if (await b.count()) await b.click(); }
  const d = await dl; if (d) { await d.saveAs(RUN + '/wave5/raw/W5-27-report.csv'); out.csvName = d.suggestedFilename(); } else out.csv = 'no download'; }
await page.keyboard.press('Escape'); await sleep(800);
await page.getByRole('button', { name: 'Report actions' }).click(); await sleep(1500);
out.actions = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-27-actions');
await page.keyboard.press('Escape'); await sleep(800);
await page.getByRole('button', { name: 'Share', exact: true }).click(); await sleep(1500);
out.share = (await page.locator('[role=menu], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('w5/W5-28-share');
await page.keyboard.press('Escape');
return fin({ out });
