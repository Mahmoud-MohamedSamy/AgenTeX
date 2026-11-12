async (page) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LID = '9f0069ec-a4a0-4f50-8342-44c1af1be1f5'; const R = {};
  const setLang = async (re) => { await page.getByRole('button', { name: /^(EN|AR|ع)/ }).first().click(); await sleep(800); const o = page.getByRole('menuitem', { name: re }).or(page.getByRole('option', { name: re })).first(); R['opt' + re] = await o.count(); if (await o.count()) await o.click(); await sleep(3000); };
  await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await setLang(/عرب|Arabic/);
  R.dir = await page.evaluate(() => document.documentElement.dir); R.listAr = (await bodyText()).match(/.{0,300}QA VR1112 R1.{0,100}/)?.[0];
  await shot('crm-M1-list-ar', false);
  await page.getByRole('button', { name: /قاعدة|New Rule/ }).first().click().catch(() => {}); await sleep(2000);
  R.editorAr = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); await shot('crm-M1-editor-ar', false);
  await openCreate(MID, LID); await typeIn('first_name', 'QA VR1112 ui M2'); await typeIn('qa_vr_phone', '+201001234567'); await typeIn('qa_vr_url', 'https://bad.example'); await save();
  R.M2_url = wrap('qa_vr_url') ? (await wrap('qa_vr_url').innerText()).replace(/\s+/g, ' ') : null;
  await typeIn('qa_vr_text', 'BAD-ar'); await save(); R.M2_text = (await wrap('qa_vr_text').innerText()).replace(/\s+/g, ' ');
  await shot('crm-M2-form-ar', false);
  await setLang(/English|EN/);
  R.dirBack = await page.evaluate(() => document.documentElement.dir);
  return R;
}
