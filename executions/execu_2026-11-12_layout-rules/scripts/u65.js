async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  // F3 multi-select filter on create
  await openCreate(mid, lid); await pick('qa_lr_filter', 'Y'); R.F3_tagsText = (await wrap('qa_lr_tags').innerText()).replace(/\s+/g, ' '); R.F3_btns = await wrap('qa_lr_tags').locator('button,[role=option],label').allInnerTexts(); await shot('crm-F3');
  // F4 edit record with Bronze, set filter X
  await openRec(mid, 'c1ea55b7-0710-4904-aa7b-1d376685a492'); await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(5000);
  R.F4_before = await valOf('qa_lr_tier'); await pick('qa_lr_filter', 'X'); await sleep(800); R.F4_after = await valOf('qa_lr_tier'); R.F4_note = (await wrap('qa_lr_tier').innerText()).replace(/\s+/g, ' ').slice(0, 120); await shot('crm-F4');
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000); R.F4_saveUrl = page.url().slice(-40); R.F4_msgs = ((await bodyText()).match(/[^.]{0,40}(saved|not one of|invalid|required)[^.]{0,80}/gi) || []).slice(0, 3);
  return R; }
