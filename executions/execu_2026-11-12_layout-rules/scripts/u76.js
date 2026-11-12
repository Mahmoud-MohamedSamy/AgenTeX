async (page) => { const R = {}; const tm = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', lid = '70fc6ce7-8ccc-490d-a68c-44853725d191';
  await openCreate(tm, lid); R.n = await page.locator('[data-rule-field]').count(); R.descReq0 = await isReq('description');
  await wrap('priority').locator('button[role=combobox]').first().click(); await sleep(700); R.opts = (await page.getByRole('option').allInnerTexts()).slice(-6); await page.getByRole('option', { name: /^highest$/i }).first().click(); await sleep(900); R.descReqHigh = await isReq('description');
  await typeIn('subject', 'QA LR1112 task G23b'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000); R.blocked = /records\/new/.test(page.url()); R.err = await errs(); await shot('crm-G23');
  return R; }
