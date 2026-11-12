async (page) => {
  const MID = '88e8ea44-1658-4df3-9930-d0902b91073d', LID = '40dced31-ff6e-4128-87c1-ffe95332389e'; const R = {};
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/out/ids-desk.json', 'utf8'));
  // create form
  await openCreate(MID, LID); R.url = page.url().replace(HOST, ''); R.fields = await page.evaluate(() => [...document.querySelectorAll('[data-rule-field]')].map(e => e.getAttribute('data-rule-field')).join(' '));
  if (await wrap('subject').count()) await typeIn('subject', 'QA VR1112 ui desk E1');
  await typeIn('qa_vr_text', 'BAD-desk'); await pick('qa_vr_pick', 'Reject'); await save();
  R.E1_stays = page.url().includes('/new'); R.E1_text = (await wrap('qa_vr_text').innerText()).replace(/\s+/g, ' '); R.E1_pick = (await wrap('qa_vr_pick').innerText()).replace(/\s+/g, ' ');
  R.other = (await page.evaluate(() => [...document.querySelectorAll('[data-rule-field]')].map(w => w.innerText.replace(/\s+/g, ' ')).filter(t => /required|must|cannot|choose/i.test(t)))).slice(0, 6);
  await shot('desk-E1-form');
  // inline edit on an existing ticket
  await openRec(MID, ids.goodRec);
  const row = page.locator('div.group', { has: page.getByText('QA VR1112 text', { exact: true }) }).first(); R.row = await row.count();
  if (R.row) { await row.scrollIntoViewIfNeeded(); await row.hover(); const eb = row.getByRole('button', { name: 'Edit field' }); R.eb = await eb.count();
    if (R.eb) { await eb.click(); await sleep(1200); const pop = page.locator('[data-radix-popper-content-wrapper], [role=dialog]').filter({ has: page.getByRole('button', { name: 'Save', exact: true }) }).last(); await pop.locator('input').first().fill('BAD-inline'); await pop.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(3000); R.G4 = (await pop.innerText().catch(() => 'closed')).replace(/\s+/g, ' '); await shot('desk-G4-inline', false); } }
  else { R.pageText = (await bodyText()).slice(0, 600); await shot('desk-ticket-page', false); }
  return R;
}
