await go('/analytics/dashboards', 10000);
await page.getByRole('button', { name: 'Switch folder' }).click(); await sleep(1500);
out.folders = (await page.locator('[role=menu], [role=listbox], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('w5/W5-29-folders'); await page.keyboard.press('Escape');
const names = ['Ticket Status Dashboard', 'SLA Dashboard', 'Overview Dashboard', 'Customer Happiness Dashboard', 'Leadership Dashboard', 'Blueprints Dashboard'];
out.dash = {};
for (const n of names) { await go('/analytics/dashboards', 8000); const l = page.locator('main').getByText(n, { exact: true }).first(); if (!(await l.count())) { out.dash[n] = 'not listed'; continue; }
  const t0 = Date.now(); await l.click(); for (let i = 0; i < 15; i++) { await sleep(2000); if (!/Loading/i.test(await mtxt())) break; }
  const tx = await mtxt(); out.dash[n] = Math.round((Date.now() - t0) / 1000) + 's ' + page.url().replace(H, '') + ' | ' + (/(error|went wrong|failed)/i.test(tx) ? 'ERROR: ' : '') + tx.slice(60, 360);
  await shot('w5/W5-29-' + n.replace(/\s+/g, '-')); }
return fin({ out });
