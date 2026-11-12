async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const txt = async (a, n = 500) => { const t = await bodyText(); const i = t.indexOf(a); return i < 0 ? 'NOTFOUND' : t.slice(i, i + n); };
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 I1 dbl' }).locator('button').nth(1).click(); await sleep(4500);
  // add 2 more conditions
  await page.locator('main button', { hasText: /^Add condition$/ }).last().click(); await sleep(800); await page.locator('main button', { hasText: /^Add condition$/ }).last().click(); await sleep(800);
  R.conds = await txt('Condition 1', 900);
  // D16: save with empty value rows
  await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(2500); R.D16 = ((await bodyText()).match(/[^.]{0,40}(needs a field|Every row|value)[^.]{0,100}/gi) || []).slice(0, 4); await shot('crm-D16');
  // C19: move condition 1 down
  R.up = await page.getByRole('button', { name: 'Move condition down' }).count(); await page.getByRole('button', { name: 'Move condition down' }).first().click(); await sleep(800); R.afterMove = await txt('Condition 1', 300);
  await page.getByRole('button', { name: 'Remove condition' }).last().click(); await sleep(800); R.condCount = ((await bodyText()).match(/Condition \d+ WHEN/g) || []).length;
  // C10 change primary field
  await page.locator('button[aria-haspopup=listbox]', { hasText: 'QA LR1112 vip' }).first().click(); await sleep(700); await page.getByRole('option', { name: 'QA LR1112 radio', exact: true }).click(); await sleep(1500);
  R.C10 = await txt('PRIMARY FIELD', 600); R.dlg = await page.locator('[role=dialog],[role=alertdialog]').count(); if (R.dlg) R.dlgTxt = (await page.locator('[role=dialog],[role=alertdialog]').first().innerText()).slice(0, 300); await shot('crm-C10');
  return R; }
