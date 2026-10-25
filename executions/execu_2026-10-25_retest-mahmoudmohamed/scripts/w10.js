const sel = page.getByRole('button', { name: /Which open activities to count/ });
const res = {};
await sel.click(); await sleep(1000); const opts = await page.locator('[role=option], [role=menuitem], [role=listbox] li').allInnerTexts(); await page.keyboard.press('Escape');
for (const p of opts.map(o => o.trim()).filter(Boolean)) {
  await sel.click(); await sleep(800); await page.locator('[role=option], [role=menuitem], [role=listbox] li').filter({ hasText: new RegExp('^' + p.replace(/[&]/g, '.') + '$') }).first().click(); await sleep(3500);
  const tr = (await txt()).match(/Total Records (\d+)/); const rows = (await page.locator('tbody tr').allInnerTexts()).map(r => (r.match(/QA RT wq t\d+/) || ['?'])[0]).filter(x => x !== '?');
  const tasksCount = (await txt()).match(/Tasks\n(\d+)/); const chip = /Priority/.test((await txt()).split('Refresh')[1]?.slice(0, 300) || '');
  res[p] = `filter chip ${chip}; Total ${tr && tr[1]}; rows ${rows.join(',')}; rail Tasks ${tasksCount && tasksCount[1]}`;
  if (/Overdue$/.test(p)) await shot('1789-03-overdue');
}
await sel.click(); await sleep(800); await page.locator('[role=option], [role=menuitem], [role=listbox] li').filter({ hasText: /^All open$/ }).first().click(); await sleep(2500);
return done({ opts, res });
