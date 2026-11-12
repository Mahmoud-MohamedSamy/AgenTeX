async (page) => {
  const A = globalThis.__APP; const R = {}; page.__dialogs = [];
  const MID = A === 'desk' ? '88e8ea44-1658-4df3-9930-d0902b91073d' : '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const MREC = A === 'desk' ? null : MID;
  const go = async () => { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000); if (await relogin()) { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation'); await sleep(5000); } };
  const rows = async () => page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim()));
  await go();
  R.K1_list = (await rows()).filter(r => /K1/.test(r)); R.K1_rawImgInDom = await page.evaluate(() => !!document.querySelector('tbody img[src="x"]'));
  await shot(A + '-K1-list', false);
  // B3 search
  const s = page.getByPlaceholder(/search rules/i); await s.fill('R4'); await sleep(1500); R.B3 = await rows(); await s.fill('zzz-none'); await sleep(1500); R.B3_none = (await bodyText()).match(/No (rules|matches)[^.]*\.?/i)?.[0] || (await rows()); await s.fill(''); await sleep(1200);
  // B4 filters: mode
  const modeBtn = page.getByRole('combobox').filter({ hasText: /Any mode/ }).first(); const modeBtn2 = page.getByRole('button', { name: /Any mode/ }).first();
  const mb = (await modeBtn.count()) ? modeBtn : modeBtn2;
  if (await mb.count()) { await mb.click(); await sleep(700); R.B4_modeOpts = (await page.getByRole('option').allInnerTexts()).join('|'); const w = page.getByRole('option', { name: /warn/i }).first(); if (await w.count()) { await w.click(); await sleep(1500); R.B4_warnRows = await rows(); } }
  await go();
  // B5 toggle the B6 rule off and back on
  const row = page.locator('tbody tr').filter({ hasText: 'QA VR1112 B6 delete me' }).first();
  const sw = row.getByRole('switch').first(); R.B5_before = await sw.getAttribute('aria-checked'); await sw.click(); await sleep(2500); R.B5_after = await sw.getAttribute('aria-checked');
  
  await sw.click(); await sleep(2500); R.B5_back = await sw.getAttribute('aria-checked');
  // B6 delete with confirm: cancel first, then confirm
  await row.getByRole('button', { name: /delete/i }).first().click(); await sleep(1000);
  R.B6_dialog = (await page.locator('[role=alertdialog],[role=dialog]').last().innerText()).replace(/\s+/g, ' ');
  await page.getByRole('button', { name: /^cancel$/i }).last().click(); await sleep(1000); R.B6_afterCancel = (await rows()).some(r => r.includes('B6 delete me'));
  await row.getByRole('button', { name: /delete/i }).first().click(); await sleep(1000); await page.locator('[role=alertdialog],[role=dialog]').last().getByRole('button', { name: /delete/i }).last().click(); await sleep(2500);
  R.B6_afterDelete = (await rows()).some(r => r.includes('B6 delete me'));
  // C12 cancel discards: open R1 edit, change name, cancel
  const r1 = page.locator('tbody tr').filter({ hasText: 'QA VR1112 R1 text' }).first();
  await r1.getByRole('button', { name: /edit/i }).first().click(); await sleep(2000);
  const dlg = page.locator('[role=dialog]').last(); R.C11_editorTitle = (await dlg.innerText()).slice(0, 60);
  await dlg.locator('input[type=text]').first().fill('QA VR1112 R1 text CHANGED'); await dlg.getByRole('button', { name: 'Cancel', exact: true }).click(); await sleep(1500);
  R.C12_confirm = (await page.locator('[role=alertdialog]').count()) ? (await page.locator('[role=alertdialog]').last().innerText()).replace(/\s+/g, ' ') : 'no discard prompt';
  if (await page.locator('[role=alertdialog]').count()) { await page.locator('[role=alertdialog]').getByRole('button', { name: /discard|leave|yes/i }).last().click().catch(() => {}); await sleep(1000); }
  R.C12_listName = (await rows()).filter(r => r.includes('R1 text'));
  // C11 edit: change message and save
  await r1.getByRole('button', { name: /edit/i }).first().click(); await sleep(2000);
  const en = page.locator('[role=dialog]').last().getByRole('textbox', { name: /english/i }).first(); R.C11_oldMsg = await en.inputValue(); await en.fill('QA R1 text cannot start with BAD (edited)');
  await page.locator('[role=dialog]').last().getByRole('button', { name: 'Save', exact: true }).click(); await sleep(3000);
  
  // K1 on the form
  if (MREC) { await openCreate(MID, '9f0069ec-a4a0-4f50-8342-44c1af1be1f5'); await typeIn('first_name', 'QA VR1112 K1'); await typeIn('qa_vr_phone', '+201001234567'); await typeIn('qa_vr_ml', 'xss here'); await save();
    R.K1_form = await page.evaluate(() => document.querySelector('[data-rule-field="qa_vr_ml"]').innerHTML.match(/.{0,40}QA K1.{0,60}/)?.[0]); R.K1_formImg = await page.evaluate(() => !!document.querySelector('[data-rule-field="qa_vr_ml"] img')); await shot(A + '-K1-form', false); }
  R.alerts = page.__dialogs;
  return R;
}
