async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/out/ids-crm.json', 'utf8'));
  const R = {};
  await openRec(mid, ids.G2);
  await page.getByRole('button', { name: 'Edit', exact: true }).first().click(); await sleep(5000);
  R.url = page.url(); R.wrappers = await page.locator('[data-rule-field]').count();
  R.G2_order_vis = await vis('qa_lr_order'); R.G2_order_val = await valOf('qa_lr_order'); R.G2_order_req = await isReq('qa_lr_order');
  await shot('crm-G2-edit');
  await pick('qa_lr_type', 'Question'); R.E6b_order_vis = await vis('qa_lr_order');
  await save(); R.after = page.url(); R.errs = await errs();
  return R;
}
