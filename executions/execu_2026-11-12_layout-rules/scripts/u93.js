async (page) => { const R = {}; const dm = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const lid = 'ca63559f-2adf-4253-9b8d-8f227d96b078';
  await openCreate(dm, lid); R.n = await page.locator('[data-rule-field]').count(); R.noteVis0 = await vis('qa_lr_appnote');
  await wrap('stage').locator('button[role=combobox]').first().click(); await sleep(700); const o = page.getByRole('option', { name: /negotiation/i }).first(); R.stageOpt = await o.innerText().catch(() => 'none'); await o.click(); await sleep(1000);
  await typeIn('discount', '10'); R.d10 = { note: await vis('qa_lr_appnote'), prob: await valOf('probability'), amountRO: await isRO('amount') };
  await typeIn('discount', '30'); R.d30 = { note: await vis('qa_lr_appnote'), noteReq: await isReq('qa_lr_appnote'), prob: await valOf('probability'), amountRO: await isRO('amount') }; await shot('crm-X4');
  await typeIn('deal_name', 'QA LR1112 deal X4'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3000); R.blocked = /records\/new/.test(page.url()); R.err = (await errs()).slice(0, 3);
  await typeIn('qa_lr_appnote', 'QA approve 30%'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000); R.saved = !/records\/new/.test(page.url()); R.url = page.url().slice(-36); R.err2 = (await errs()).slice(0, 3);
  return R; }
