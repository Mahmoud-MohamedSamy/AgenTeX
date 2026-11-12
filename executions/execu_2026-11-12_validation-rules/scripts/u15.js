async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/out/ids-crm.json', 'utf8'));
  const items = async () => (await page.locator('[role=menuitem],[role=option]').allInnerTexts()).map(s => s.trim()).filter(Boolean);
  // G8 clone via Row actions
  await openRec(mid, ids.goodRec);
  await page.getByRole('button', { name: 'Row actions' }).first().click(); await sleep(900); R.rowActions = (await items()).join('|');
  const cl = page.getByRole('menuitem', { name: /clone|duplicate|copy/i }).first();
  if (await cl.count()) { await cl.click(); await sleep(5000); R.G8_url = page.url().replace(HOST, ''); R.G8_text = await valOf('qa_vr_text');
    if (await wrap('qa_vr_text').count()) { await typeIn('qa_vr_text', 'BAD-clone'); await typeIn('qa_vr_phone', '+201001234567'); await save(); R.G8_after = page.url().replace(HOST, ''); R.G8_msg = (await wrap('qa_vr_text').innerText()).replace(/\s+/g, ' '); await shot('crm-G8-clone', false); } }
  else await page.keyboard.press('Escape');
  // G5 quick create via list "More create options"
  await page.goto(HOST + '/modules/' + mid + '/records', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: 'More create options' }).first().click(); await sleep(900); R.createOpts = (await items()).join('|');
  const qc = page.getByRole('menuitem', { name: /quick/i }).first();
  if (await qc.count()) { await qc.click(); await sleep(3000); const dlg = page.locator('[role=dialog]').last(); R.G5_fields = await dlg.evaluate(d => [...d.querySelectorAll('[data-rule-field]')].map(e => e.getAttribute('data-rule-field')).join(' ')).catch(() => '');
    R.G5_layoutPicker = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await shot('crm-G5-quick', false); }
  else await page.keyboard.press('Escape');
  // views (Kanban)
  await page.goto(HOST + '/modules/' + mid + '/records', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: 'Module actions' }).first().click().catch(() => {}); await sleep(800); R.moduleActions = (await items()).join('|'); await page.keyboard.press('Escape');
  R.viewSwitch = await page.evaluate(() => [...document.querySelectorAll('[role=tab],[role=radio],button')].map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(t => /kanban|board|list|table|view/i.test(t)).slice(0, 10));
  return R;
}
