// NDC-1819 item 11: On a specific date (17 Oct and 19 Oct) and the two rows returned by Overdue.
const out = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks\b/ }).count()); i++) await sleep(1000); await sleep(2000);
const sel = page.getByRole('button', { name: 'Which open activities to count and list' });
const choose = async o => { await sel.click(); await sleep(800); await page.locator('[role=listbox] [role=option], [role=menu] [role^=menuitem]').filter({ hasText: new RegExp('^\\s*' + o + '\\s*$') }).first().click(); await sleep(8000); };
const rowsTxt = async () => (await page.locator('main tbody tr').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()).slice(0, 12);
await choose('Overdue'); await page.getByRole('button', { name: /^Tasks\b/ }).first().click(); await sleep(5000);
out.overdueRows = await rowsTxt(); await shot('NDC-1819-f-period-overdue');
await choose('On a specific date');
const di = page.locator('main input[type=date]').first(); out.dateInput = await di.count();
for (const dte of ['2026-10-17', '2026-10-19']) { if (!out.dateInput) break; await di.fill(dte); await sleep(7000);
  await page.getByRole('button', { name: /^Tasks\b/ }).first().click(); await sleep(5000);
  out['on_' + dte] = { side: ((await page.locator('main').first().innerText()).replace(/\s+/g, ' ').match(/My Open Activities.{0,90}/) || [''])[0], total: ((await txt()).match(/Total Records\s*\d+/) || [''])[0], rows: await rowsTxt() };
  await shot('NDC-1819-f-specific-' + dte); }
await choose('All open');
return done(out);
