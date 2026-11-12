async (page) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LID = '9f0069ec-a4a0-4f50-8342-44c1af1be1f5'; const R = {};
  const saveAr = async () => { await page.getByRole('button', { name: /^(Save|حفظ)$/ }).last().click(); await sleep(3500); };
  R.dir = await page.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang);
  await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  R.listAr = (await bodyText()).match(/.{0,400}QA VR1112 R1.{0,80}/)?.[0]; await shot('crm-M1-list-ar', false);
  await page.locator('main button').filter({ hasText: /قاعدة|Rule/ }).first().click().catch(() => {}); await sleep(2000);
  R.editorAr = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 700); await shot('crm-M1-editor-ar', false);
  await openCreate(MID, LID); await typeIn('first_name', 'QA VR1112 ui M2'); await typeIn('qa_vr_phone', '+201001234567'); await typeIn('qa_vr_url', 'https://bad.example'); await saveAr();
  R.M2_url = (await wrap('qa_vr_url').innerText()).replace(/\s+/g, ' '); R.M2_text = (await wrap('qa_vr_text').innerText()).replace(/\s+/g, ' ');
  await shot('crm-M2-form-ar', false);
  // back to English
  await page.getByRole('button', { name: /^(AR|EN|ع)/ }).first().click().catch(() => {}); await sleep(800);
  const en = page.getByRole('menuitem', { name: /English/ }).or(page.getByRole('option', { name: /English/ })).first(); R.enOpt = await en.count(); if (R.enOpt) await en.click(); await sleep(3000);
  R.dirBack = await page.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang);
  return R;
}
