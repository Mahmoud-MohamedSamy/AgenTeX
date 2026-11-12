async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  for (const id of ['0abf46ab-9372-4b26-a1e3-9c0634903cb7', '29bb450e-9c1b-4a39-8ddb-3f4ac6067325']) {
    await page.goto(HOST + '/modules/' + mid + '/records/new?clone_from=' + id + '&layout=' + lid + '&clone_subforms=1&clone_tags=1', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field]', { timeout: 30000 }).catch(() => {}); await sleep(4000);
    R[id.slice(0, 4)] = { type: await valOf('qa_lr_type'), tier: await valOf('qa_lr_tier'), orderVis: await vis('qa_lr_order'), orderReq: await isReq('qa_lr_order'), secB: await vis('qa_lr_reason') };
  }
  await shot('crm-G6'); return R; }
