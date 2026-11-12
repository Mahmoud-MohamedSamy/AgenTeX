async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  const R = {};
  await openCreate(mid, lid);
  R.tierOptsBefore = (await options('qa_lr_tier')).filter(o => ['Gold','Silver','Bronze'].includes(o));
  R.textRO_before = await isRO('qa_lr_text');
  await pick('qa_lr_filter', 'X');
  R.F2_tierOpts = (await options('qa_lr_tier')).filter(o => ['Gold','Silver','Bronze'].includes(o));
  R.F6_textRO = await isRO('qa_lr_text');
  R.F10_note = await valOf('qa_lr_note');
  const t = await bodyText();
  R.F13_suggest = (t.match(/Suggested[^A-Z]{0,40}/) || [''])[0]; R.F17_msg = t.includes('QA warn msg');
  await shot('crm-F-X');
  // F11 change note by hand, change other field, check value kept
  await typeIn('qa_lr_note', 'QA hand'); await typeIn('qa_lr_amount', 7); R.F11_note_after = await valOf('qa_lr_note');
  // F13 accept suggestion? amount typed already; check suggestion box still
  // Y branch
  await pick('qa_lr_filter', 'Y'); const t2 = await bodyText(); R.F18_top = t2.includes('QA top info'); R.F17_gone = !t2.includes('QA warn msg');
  R.F6_textRO_afterY = await isRO('qa_lr_text');
  try { await wrap('qa_lr_tags').locator('input, button, [role=combobox]').first().click(); await sleep(700); R.F3_tags = (await page.getByRole('option').allInnerTexts()).map(s=>s.trim()).filter(o => ['A','B','C'].includes(o)); await page.keyboard.press('Escape'); } catch (e) { R.F3_tags = 'n/a ' + e.message.slice(0,60); }
  await shot('crm-F-Y');
  // back to X and save -> verify fields dialog
  await pick('qa_lr_filter', 'X'); R.F10_reapplied = await valOf('qa_lr_note');
  await typeIn('first_name', 'QA LR1112 rec F'); await typeIn('qa_lr_email2', 'qa.f@example.com');
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(2500);
  const dlg = page.locator('[role=dialog], [role=alertdialog]').last(); R.F24_dialog = (await dlg.count()) ? (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 400) : '';
  await shot('crm-F24-verify', false);
  R.url = page.url();
  return R;
}
