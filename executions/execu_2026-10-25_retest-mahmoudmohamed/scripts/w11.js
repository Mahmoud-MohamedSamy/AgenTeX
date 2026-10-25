const sel = page.getByRole('button', { name: /Which open activities to count/ });
const res = {};
for (const p of ['Today & Overdue', 'Due today', 'Tomorrow', 'Overdue', 'Next 7 days', 'This week', 'This month', 'Next month', 'All open']) {
  await sel.click(); await sleep(800); await page.locator('[role=option], [role=menuitem], [role=listbox] li').filter({ hasText: new RegExp('^' + p + '$') }).first().click();
  await sleep(6000);
  const rail = (await page.getByRole('button', { name: /^Tasks, \d+ items/ }).getAttribute('aria-label').catch(() => '')) || '';
  const tr = (await txt()).match(/Total Records (\d+)/);
  res[p] = `rail "${rail}" | grid Total ${tr && tr[1]} (High filter on)`;
}
await shot('1819-01-rail-counts');
return done(res);
