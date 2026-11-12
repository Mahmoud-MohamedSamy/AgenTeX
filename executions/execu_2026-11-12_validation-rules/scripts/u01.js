async (page) => {
  const MID = globalThis.__APP === 'desk' ? '88e8ea44-1658-4df3-9930-d0902b91073d' : '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const A = globalThis.__APP; const R = {};
  const go = async () => { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(6000); };
  await go(); if (await relogin()) await go();
  R.url = page.url().replace(HOST, '');
  R.tabs = (await page.locator('[role=tab]').allInnerTexts()).map(s => s.trim()).filter(Boolean).join(' | ');
  R.list = (await bodyText()).slice(0, 2500);
  await shot(A + '-B2-list');
  const nb = page.getByRole('button', { name: /new (validation )?rule/i }).first();
  R.newBtn = await nb.count();
  if (R.newBtn) { await nb.click(); await sleep(2500); R.editor = (await page.locator('[role=dialog]').last().innerText().catch(() => bodyText())).replace(/\s+/g, ' ').slice(0, 3000); await shot(A + '-C2-editor', false); }
  return R;
}
