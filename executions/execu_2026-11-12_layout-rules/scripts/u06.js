async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/out/ids-crm.json', 'utf8'));
  const R = {};
  // G3 record page view: G2 record type Refund -> order visible; G4 record type Question -> order hidden
  await openRec(mid, ids.G2); R.G3_refund_order_vis = await vis('qa_lr_order'); R.G3_hasRuleWrappers = await page.locator('[data-rule-field]').count();
  R.G3_text_has_existing = (await bodyText()).includes('QA existing order');
  await shot('crm-G3-view-refund');
  await openRec(mid, ids.G4); R.G3_question_order_vis = await vis('qa_lr_order'); R.G3_q_text_has_order_label = (await bodyText()).includes('QA LR1112 order');
  await shot('crm-G3-view-question');
  // edit buttons
  const btns = await page.getByRole('button').allInnerTexts(); R.btns = btns.map(s => s.trim()).filter(s => s && s.length < 20).slice(0, 25);
  return R;
}
