async (page) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LID = '9f0069ec-a4a0-4f50-8342-44c1af1be1f5'; const R = {};
  const URL = HOST + '/settings/modules-and-fields/' + MID + '?tab=validation';
  await page.goto(URL, { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000);
  const d = page.locator('[role=dialog]').last(); const btn = l => d.getByRole('button', { name: l, exact: true }).first();
  await d.locator('input[type=text]').first().fill('QA VR1112 C15 tmp');
  await btn('Layout').click(); await sleep(700); await page.getByRole('option').filter({ hasText: 'QA VR1112 Layout' }).first().click(); await sleep(900);
  await btn('Field to check').click(); await sleep(700); await page.getByRole('option').filter({ hasText: 'QA VR1112 num' }).first().click(); await sleep(1200);
  await btn('Add condition').click(); await sleep(800);
  R.C13_conditions = (await d.innerText()).match(/Condition \d/g);
  R.C13_moveBtns = await d.getByRole('button', { name: 'Move up' }).count();
  // C15 change field after conditions
  await btn('Field to check').click(); await sleep(700); await page.getByRole('option').filter({ hasText: 'QA VR1112 date' }).first().click(); await sleep(1500);
  R.C15_prompt = (await page.locator('[role=alertdialog]').count()) ? (await page.locator('[role=alertdialog]').last().innerText()).replace(/\s+/g, ' ') : 'no prompt';
  if (await page.locator('[role=alertdialog]').count()) { await page.locator('[role=alertdialog]').getByRole('button').last().click(); await sleep(1000); }
  R.C15_after = (await d.innerText()).replace(/\s+/g, ' ').match(/Condition 1.{0,160}/)?.[0]; R.C15_conds = (await d.innerText()).match(/Condition \d/g);
  await shot('crm-C15-change-field', false);
  // F5: switch to Function and look for a test button
  await d.locator('input[type=radio][value=function]').check({ force: true }).catch(() => {}); await sleep(1200);
  R.F_section = (await d.innerText()).replace(/\s+/g, ' ').match(/RULE TYPE.{0,700}/)?.[0];
  R.F_buttons = await d.evaluate(x => [...x.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.innerText).trim()).filter(Boolean));
  await shot('crm-F5-function-editor', false);
  await btn('Cancel').click(); await sleep(800);
  // N2 verify chattiness
  const calls = []; const h = r => { if (/validation-rules\/verify/.test(r.url())) calls.push(Date.now()); }; page.on('request', h);
  await openCreate(MID, LID); const ph = wrap('qa_vr_phone').locator('input').first(); await ph.click(); await ph.pressSequentially('+2010012345', { delay: 80 }); await sleep(2500);
  page.off('request', h); R.N2_calls = calls.length;
  // G6 Kanban
  await page.goto(HOST + '/modules/' + MID + '/records', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: 'Kanban view' }).first().click().catch(() => {}); await sleep(5000);
  R.G6 = (await bodyText()).slice(0, 500); await shot('crm-G6-kanban', false);
  return R;
}
