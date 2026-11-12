async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/out/ids-crm.json', 'utf8'));
  const rec = ids.goodRec;
  // G4 inline edit
  await openRec(mid, rec);
  const row = page.locator('div.group', { has: page.getByText('QA VR1112 text', { exact: true }) }).first();
  R.rowFound = await row.count();
  if (R.rowFound) { await row.scrollIntoViewIfNeeded(); await row.hover(); const eb = row.getByRole('button', { name: 'Edit field' }); R.editBtn = await eb.count();
    if (R.editBtn) { await eb.click(); await sleep(1200); await shot('crm-G4-open', false); const pop = page.locator('[data-radix-popper-content-wrapper], [role=dialog]').filter({ has: page.getByRole('button', { name: 'Save', exact: true }) }).last(); const inp = pop.locator('input').first(); R.focus = await inp.count(); if (!R.focus) return R; await inp.fill('BAD-inline'); await pop.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(3000); R.G4_pop = (await pop.innerText().catch(() => 'closed')).replace(/\s+/g, ' ');
      R.G4_row = (await row.innerText()).replace(/\s+/g, ' '); R.G4_msgs = (await bodyText()).match(/.{0,60}QA R1 text cannot start with BAD.{0,40}/g); await shot('crm-G4-inline', false); } }
  // G2 edit page
  await openRec(mid, rec); const edit = page.getByRole('button', { name: /^Edit$/ }).first(); R.editPageBtn = await edit.count();
  if (R.editPageBtn) { await edit.click(); await sleep(4000); R.G2_url = page.url().replace(HOST, '');
    if (await wrap('qa_vr_text').count()) { await typeIn('qa_vr_text', 'BAD-edit'); await save(); R.G2_stays = page.url().replace(HOST, ''); R.G2_msg = (await wrap('qa_vr_text').innerText()).replace(/\s+/g, ' '); await shot('crm-G2-edit', false); } }
  // G8 clone
  await openRec(mid, rec);
  const more = page.getByRole('button', { name: /more|actions/i }).first(); R.more = await more.count();
  if (R.more) { await more.click(); await sleep(800); R.moreItems = (await page.getByRole('menuitem').allInnerTexts()).join('|'); const cl = page.getByRole('menuitem', { name: /clone/i }).first();
    if (await cl.count()) { await cl.click(); await sleep(4000); R.G8_url = page.url().replace(HOST, ''); if (await wrap('qa_vr_text').count()) { await typeIn('qa_vr_text', 'BAD-clone'); await save(); R.G8_after = page.url().replace(HOST, ''); R.G8_msg = (await wrap('qa_vr_text').innerText()).replace(/\s+/g, ' '); await shot('crm-G8-clone', false); } } else await page.keyboard.press('Escape'); }
  return R;
}
