async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/out/ids-crm.json', 'utf8'));
  await openRec(mid, ids.G4); const R = {};
  const row = page.locator('div.group', { has: page.getByText('QA LR1112 type', { exact: true }) }).first();
  await row.hover(); await row.getByRole('button', { name: 'Edit field' }).click(); await sleep(1500);
  await shot('crm-G4-inline-open', false);
  // pick Refund in the inline editor
  const cb = page.locator('button[role=combobox]').first(); await cb.click(); await sleep(600);
  await page.getByRole('option', { name: 'Refund', exact: true }).first().click(); await sleep(1000);
  await shot('crm-G4-inline-picked', false);
  R.textAfterPick = (await bodyText()).match(/.{0,120}(order|required|mandatory).{0,120}/i)?.[0] || '';
  const saveBtn = page.getByRole('button', { name: /^(Save|✓|Apply)$/ }); R.saveBtns = await saveBtn.count();
  if (R.saveBtns) { await saveBtn.first().click(); } else { await page.keyboard.press('Enter'); }
  await sleep(3000);
  R.after = (await bodyText()).match(/.{0,100}(required|saved|updated|fail|error).{0,100}/i)?.[0] || '';
  await shot('crm-G4-inline-after', false);
  return R;
}
