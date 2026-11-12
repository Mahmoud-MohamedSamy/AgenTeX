async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: /New Layout Rule/ }).click(); await sleep(4000);
  const t = await bodyText(); const i = t.indexOf('Preview'); R.prevNoLayout = i < 0 ? 'NO PREVIEW TEXT' : t.slice(i, i + 300); R.head = t.slice(t.indexOf('New Layout Rule'), t.indexOf('New Layout Rule') + 600); await shot('crm-L3');
  // C12 back without saving: type a name then Cancel
  const nm = page.locator('input').first(); await nm.fill('QA LR1112 unsaved'); await sleep(500);
  await page.getByRole('button', { name: /^Cancel$/ }).first().click(); await sleep(2000);
  R.afterCancel = (await bodyText()).slice(0, 0) + (page.__dialogs || []).join('|'); R.dialogVisible = await page.locator('[role=alertdialog], [role=dialog]').count(); R.dlgText = R.dialogVisible ? (await page.locator('[role=alertdialog], [role=dialog]').first().innerText()).slice(0, 300) : '';
  await shot('crm-C12');
  return R; }
