async (page) => { const R = {};
  await page.goto(HOST + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(7000);
  await page.locator('tbody tr').filter({ hasText: 'C7 dept rule' }).first().getByRole('button').first().click(); await sleep(2500);
  const d = page.locator('[role=dialog]').last(); R.dept = ((await d.innerText()).replace(/\s+/g, ' ').match(/DEPARTMENTS.{0,250}/) || [''])[0];
  await shot('desk-C7-editor', false);
  await d.getByRole('button', { name: 'Save', exact: true }).first().click(); await sleep(2500);
  R.afterSave = (await page.locator('[role=dialog]').count()) ? ((await page.locator('[role=dialog]').last().innerText()).replace(/\s+/g, ' ').slice(0, 300)) : 'dialog closed';
  R.toast = ((await bodyText()).match(/(saved|updated|error|could not)[^.]{0,120}/i) || [''])[0];
  if (await page.locator('[role=dialog]').count()) await page.keyboard.press('Escape');
  return R; }
