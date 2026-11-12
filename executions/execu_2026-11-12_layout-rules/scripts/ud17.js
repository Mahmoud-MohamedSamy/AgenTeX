async (page) => { const R = {}; const mid = '88e8ea44-1658-4df3-9930-d0902b91073d', lid = 'e8eb01f2-214d-4ce1-9790-8d8a93c2e953';
  await openCreate(mid, lid); R.reason0 = await vis('qa_lr_note'); R.status0 = await valOf('status');
  await wrap('status').locator('button[role=combobox]').first().click(); await sleep(800); await page.getByRole('option', { name: 'QA NDC Rejected', exact: true }).first().click(); await sleep(1200);
  R.reasonRej = await vis('qa_lr_note'); R.reasonReq = await isReq('qa_lr_note');
  await typeIn('subject', 'QA LR1112 X1 ticket2'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000); R.blocked = /records\/new/.test(page.url()); R.err1 = (await errs()).slice(0, 3); await shot('desk-X1-blocked');
  if (R.blocked) { await typeIn('qa_lr_note', 'QA rejected because test'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(5000); R.saved = !/records\/new/.test(page.url()); R.url = page.url().slice(-40); R.err2 = (await errs()).slice(0, 3); await shot('desk-X1-saved'); }
  return R; }
