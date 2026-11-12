async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  const st = async () => { const o = {}; for (const f of ['qa_lr_tags','qa_lr_note','qa_lr_amount','qa_lr_email2','qa_lr_text','phone']) o['req_'+f] = await isReq(f); Object.assign(o, await visMany(['qa_lr_reason','qa_lr_order','qa_lr_note'])); return o; };
  await openCreate(mid, lid); R.base = await st();
  await page.locator('[data-rule-field=qa_lr_radio] input[value=No]').check(); await sleep(1200);
  R.no_empty = await st();
  await typeIn('qa_lr_text','xxabcxx'); R.contains = await st();
  await typeIn('qa_lr_text','QA test xyz'); R.starts_ends = await st();
  await typeIn('qa_lr_text','123'); R.regex = await st();
  await typeIn('qa_lr_text','this text is longer than twenty'); R.len = await st(); await shot('crm-D11');
  await typeIn('qa_lr_text','or1'); R.or_text = await st();
  await typeIn('qa_lr_text','zzz'); await typeIn('qa_lr_amount','7'); R.or_amount = await st();
  await typeIn('qa_lr_amount','100'); R.gte100 = await st();
  await typeIn('qa_lr_amount','5'); await typeIn('qa_lr_email2','qa@example.com'); R.notnull_nomatch = await st(); await shot('crm-D14');
  await tick('qa_lr_vip', true); R.dateVis = await vis('qa_lr_date');
  const di = wrap('qa_lr_date').locator('input').first(); R.dateType = await di.getAttribute('type'); await di.fill('2026-05-01').catch(e => R.dateErr = e.message.slice(0,100)); await di.press('Tab').catch(()=>{}); await sleep(900); R.date = await st(); R.dateVal = await valOf('qa_lr_date');
  return R; }
