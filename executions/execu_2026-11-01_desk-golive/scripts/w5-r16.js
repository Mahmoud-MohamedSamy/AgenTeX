const RID = 'efa2c92a-7145-4b79-85e8-1de588d04ff0';
await go('/analytics/reports', 8000);
await page.getByText('QA GL W5 report').first().click(); await sleep(8000);
out.url = page.url().replace(H, ''); out.view = (await mtxt()).slice(0, 700);
out.btns = await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean));
await shot('w5/W5-27-report-view');
const exp = page.locator('main').getByRole('button', { name: /Export|Download|More|actions/i }).first();
if (await exp.count()) { await exp.click(); await sleep(1500); out.expMenu = (await page.locator('[role=menu], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-27-export-menu');
  const csv = page.getByRole('menuitem', { name: /CSV/i }).first();
  if (await csv.count()) { const dl = page.waitForEvent('download', { timeout: 30000 }).catch(() => null); await csv.click(); const d = await dl; if (d) { const p = RUN + '/wave5/raw/W5-27-report.csv'; await d.saveAs(p); out.csv = require ? 'saved' : 'saved'; out.csvName = d.suggestedFilename(); } else out.csv = 'no download event'; await sleep(3000); out.afterCsv = (await dtxt()).slice(0, 300); }
  await page.keyboard.press('Escape'); }
const sch = await api('GET', '/reporting/schedules'); out.sched = sch.s + ' ' + sch.t.slice(0, 200);
return fin({ out });
