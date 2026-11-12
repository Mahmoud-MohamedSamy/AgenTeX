async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await page.goto(HOST + '/modules/' + mid + '/records/new?clone_from=33f5145a-fe4a-4577-9193-ed613006abef&layout=' + lid + '&clone_subforms=1&clone_tags=1', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field]', { timeout: 30000 }).catch(() => {}); await sleep(5000);
  R.vals = { type: await valOf('qa_lr_type'), tier: await valOf('qa_lr_tier'), order: await valOf('qa_lr_order') }; R.vis = await visMany(['qa_lr_order', 'qa_lr_reason']); R.orderReq = await isReq('qa_lr_order'); R.noteReq = await isReq('qa_lr_note');
  await shot('crm-G6'); await typeIn('qa_lr_order', ''); await typeIn('first_name', 'QA LR1112 rec G6 clone'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000); R.blocked = /records\/new/.test(page.url()); R.url = page.url().slice(-40);
  return R; }
