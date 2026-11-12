async (page) => {
  const A = globalThis.__APP; const R = {};
  const MID = A === 'desk' ? '88e8ea44-1658-4df3-9930-d0902b91073d' : '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const fresh = async () => { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000); if (await relogin()) { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation'); await sleep(5000); } await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000); };
  const dlg = () => page.locator('[role=dialog]').last();
  const btn = (label) => dlg().getByRole('button', { name: label, exact: true }).first();
  const choose = async (label, text, exact) => { await btn(label).click(); await sleep(900); const o = exact ? page.getByRole('option', { name: text, exact: true }).first() : page.getByRole('option').filter({ hasText: text }).first(); if (!(await o.count())) return 'no option'; await o.click({ force: true }); await sleep(1200); return 'ok'; };
  await fresh();
  // C2 required inputs: save empty
  await btn('Save').click(); await sleep(1500);
  R.C2 = (await dlg().innerText()).replace(/\s+/g, ' ').match(/[^.]*(required|Enter|Choose|needs)[^.]*\./gi)?.slice(0, 6);
  await shot(A + '-C2-required', false);
  await dlg().locator('input[type=text]').first().fill('QA VR1112 C1 ui');
  await dlg().locator('textarea').first().fill('made in the editor');
  R.lay = await choose('Layout', 'QA VR1112 Layout');
  R.fld = await choose('Field to check', 'QA VR1112 url');
  await btn('Operator').click(); await sleep(800);
  R.urlOps = (await page.getByRole('option').allInnerTexts()).map(s => s.trim());
  const op = page.getByRole('option', { name: /^contains$/i }).first(); if (await op.count()) await op.click(); else await page.getByRole('option').filter({ hasText: 'contains' }).first().click(); await sleep(800);
  const val = dlg().getByRole('textbox', { name: /value/i }).first(); if (await val.count()) await val.fill('bad'); else { const ins = dlg().locator('input[type=text]'); await ins.nth(1).fill('bad'); }
  const tas = dlg().locator('textarea'); const n = await tas.count(); R.textareas = n;
  const msgs = dlg().locator('textarea, input').filter({ hasNot: page.locator('[type=radio]') });
  // messages: fill the last two text boxes in the condition card (EN, AR)
  const boxes = await dlg().evaluate(d => [...d.querySelectorAll('textarea,input[type=text]')].map(e => e.getAttribute('aria-label') || e.placeholder || e.id));
  R.boxes = boxes;
  const en = dlg().getByRole('textbox', { name: /english/i }).first(), ar = dlg().getByRole('textbox', { name: /arabic/i }).first();
  if (await en.count()) await en.fill('QA C1 url must not contain bad'); if (await ar.count()) await ar.fill('الرابط لا يجب أن يحتوي على bad');
  await shot(A + '-C1-filled', false);
  await btn('Save').click(); await sleep(3500);
  R.afterSave = (await page.innerText('body')).replace(/\s+/g, ' ').match(/(QA VR1112 C1 ui.{0,160})|(error.{0,200})/i)?.[0];
  R.dialogOpen = await page.locator('[role=dialog]').count();
  if (R.dialogOpen) R.dialogText = (await dlg().innerText()).replace(/\s+/g, ' ').slice(0, 800);
  await shot(A + '-C1-saved', false);
  return R;
}
