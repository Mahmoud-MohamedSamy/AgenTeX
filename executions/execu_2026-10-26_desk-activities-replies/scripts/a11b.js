// ACT batch 11: H1 add from ticket tab, H6 close ticket with open task, J3 bulk update, J7 export, K1 calendar, N1 workflow modules
const waitList = async () => { for (let i = 0; i < 40 && !(await txt()).includes('Total Count'); i++) await sleep(1000); await sleep(1500); };
const toastT = async () => (await page.$$eval('[data-sonner-toast]', ts => ts.map(t => t.innerText.replace(/\s+/g, ' ')).join(' | ')).catch(() => ''));
try {
  // (H1, H6 done in run 1)
  // J3 bulk update: Table layout on Tasks, search 'QA ACT B', select 3, Update status
  await go('/activities', 5000); await waitList();
  await page.getByRole('button', { name: 'Table' }).click(); await sleep(3000);
  await page.getByRole('button', { name: 'Search in this view' }).click().catch(() => {}); await sleep(400);
  await page.locator('main input[type=search], main input[placeholder*="Search" i]').first().fill('QA ACT B d'); await sleep(3500);
  const boxes = page.locator('main [role=checkbox], main input[type=checkbox]'); const nb = await boxes.count();
  for (let i = 1; i < Math.min(nb, 3); i++) await boxes.nth(i).click(); await sleep(800);
  await page.locator('main button').filter({ hasText: /^Update$/ }).click(); await sleep(1500);
  const ud = page.locator('[role=dialog]').last(); const udt = (await ud.innerText()).replace(/\s+/g, ' ');
  const sel = ud.locator('select, [role=combobox], button[aria-haspopup]'); const sc = await sel.count();
  rec('ACT-J3-dialog', 'INFO', `rows selected=${Math.min(nb, 3) - 1}; dialog="${udt.slice(0, 300)}"; controls=${sc}`, { shot: await shot('ACT-J3-dialog') });
  await page.keyboard.press('Escape'); await sleep(500);
  await page.getByRole('button', { name: 'Classic' }).click().catch(() => {});
  // J7 export dialog
  await page.getByRole('button', { name: 'Export this view' }).click(); await sleep(1500); const ex = (await page.locator('[role=dialog]').last().innerText()).replace(/\s+/g, ' ');
  rec('ACT-J7-dialog', /Export this view/.test(ex) ? 'PASS' : 'FAIL', ex.slice(0, 300)); await page.keyboard.press('Escape');
  // K1 calendar
  await go('/calendar', 10000); const kc = await txt(); rec('ACT-K1', /Month|Week|Day/.test(kc) ? 'INFO' : 'FAIL', 'calendar loads; mentions QA ACT: ' + /QA ACT/.test(kc));
  // N1 workflow module list
  const wf = await api('GET', '/workflow/rules?take=1'); const mods_ = await api('GET', '/modules'); rec('ACT-N1', 'INFO', 'workflow rules GET ' + wf.s);
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); await shot('a11-error'); }
return fin();
