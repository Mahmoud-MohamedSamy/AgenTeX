async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const R = {};
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(7000);
  await page.getByRole('button', { name: 'New Layout Rule' }).first().click(); await sleep(3000);
  R.url = page.url();
  await shot('crm-editor-new');
  await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(1500);
  R.C2_empty = (await bodyText()).match(/(Enter a rule name|Choose a layout|Choose a primary field|Add at least one condition|Fix the highlighted)[^.]*\./g);
  await shot('crm-C2-empty-save');
  // list comboboxes / labels in editor
  R.combos = await page.locator('button[role=combobox], select').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.id || e.name || e.innerText || '').trim().slice(0, 40)));
  return R;
}
