async (page) => {
  const A = globalThis.__APP; const R = {};
  const dlg = page.locator('[role=dialog]').last();
  if (!(await dlg.count())) { await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000); }
  const open = async (label) => { await dlg.getByRole('button', { name: label, exact: true }).first().click(); await sleep(900); const pop = page.locator('[role=listbox], [role=menu], [data-radix-popper-content-wrapper]').last(); const t = (await pop.innerText().catch(() => '')).replace(/\n+/g, ' | '); return t; };
  R.layouts = (await open('Layout')).slice(0, 1500); await shot(A + '-C5-layouts', false); await page.keyboard.press('Escape'); await sleep(500);
  R.fields = (await open('Field to check')).slice(0, 6000); await shot(A + '-C3-fields', false);
  await page.keyboard.press('Escape'); await sleep(500);
  return R;
}
