async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  const hdr = () => page.evaluate(() => { const e = [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && (e.textContent || '').trim() === 'QA LR1112 Sec B'); return e.some(x => x.getBoundingClientRect().height > 0); });
  await openCreate(mid, lid); R.createEmpty = await hdr(); await pick('qa_lr_type', 'Question'); R.createQ = await hdr();
  await page.goto(HOST + '/modules/' + mid + '/records/new?clone_from=0abf46ab-9372-4b26-a1e3-9c0634903cb7&layout=' + lid + '&clone_subforms=1&clone_tags=1', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field]', { timeout: 30000 }).catch(() => {}); await sleep(5000);
  R.cloneType = await valOf('qa_lr_type'); R.cloneQ = await hdr(); await shot('crm-G6');
  await openRec(mid, '0abf46ab-9372-4b26-a1e3-9c0634903cb7'); await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(5000); R.editQ = await hdr();
  return R; }
