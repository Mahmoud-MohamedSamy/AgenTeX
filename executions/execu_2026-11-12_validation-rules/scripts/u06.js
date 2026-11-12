async (page) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LID = '9f0069ec-a4a0-4f50-8342-44c1af1be1f5'; const R = {};
  const near = async f => page.evaluate(f => { const w = document.querySelector(`[data-rule-field="${f}"]`); if (!w) return null; return w.innerText.replace(/\s+/g, ' ').slice(0, 200); }, f);
  const topMsg = async () => page.evaluate(() => [...document.querySelectorAll('[role=alert]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 5));
  const base = async () => { await openCreate(MID, LID); await typeIn('first_name', 'QA VR1112 ui'); };
  // E1 / E10 / E11 / G1
  await base(); await typeIn('qa_vr_text', 'BAD-ui'); await save();
  R.E1_url = page.url().includes('/new'); R.E1_field = await near('qa_vr_text'); R.E1_alerts = await topMsg(); R.E10_value = await valOf('qa_vr_text'); R.E10_name = await valOf('first_name');
  await shot('crm-E1-under-field');
  await typeIn('qa_vr_text', 'GOOD-ui'); await save(); R.E11_url = page.url().replace(HOST, ''); R.E11_saved = !page.url().includes('/new');
  // E8 two broken rules + E2 top placement
  await base(); await typeIn('qa_vr_text', 'BAD-e8'); await pick('qa_vr_pick', 'Reject'); await typeIn('qa_vr_email', 'x@bad.com'); await save();
  R.E8_text = await near('qa_vr_text'); R.E8_pick = await near('qa_vr_pick'); R.E2_email = await near('qa_vr_email'); R.E2_alerts = await topMsg();
  R.E2_body = (await bodyText()).match(/.{0,80}QA E2 no bad\.com emails.{0,40}/g);
  await shot('crm-E8-E2-messages');
  // E6 field verification while typing
  await base(); const ph = wrap('qa_vr_phone').locator('input').first(); await ph.fill('+1555'); await sleep(2500);
  R.E6_typing = await near('qa_vr_phone'); await shot('crm-E6-typing', false);
  await ph.fill('+201001234567'); await sleep(2500); R.E6_fixed = await near('qa_vr_phone');
  // E3 warn dialog
  await typeIn('qa_vr_note', 'WARN'); await save(); await sleep(1000);
  R.E3_dialog = (await page.locator('[role=alertdialog],[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
  await shot('crm-E3-warn', false);
  const sa = page.getByRole('button', { name: /save anyway|continue|confirm|yes/i }).last(); R.E3_btn = await sa.count();
  if (R.E3_btn) { R.E3_btnText = await sa.innerText(); await sa.click(); await sleep(4000); }
  R.E3_saved = !page.url().includes('/new'); R.E3_url = page.url().replace(HOST, '');
  return R;
}
