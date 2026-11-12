async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  const has = async t => (await page.getByText(t, { exact: false }).count()) > 0;
  // F22/F23 on record pages
  for (const [k, id] of [['partner', '2ca6bc00-4cbd-4d73-9f0c-08805e783556'], ['question', 'b0820d1f-bf72-4699-b121-0c2dbf0458a9']]) { await openRec(mid, id); R[k] = { btn: await has('QA LR1112 btn'), link: await has('QA LR1112 link') }; await shot('crm-F22-' + k); }
  // create form: button/link
  await openCreate(mid, lid); R.createNone = { btn: await has('QA LR1112 btn'), link: await has('QA LR1112 link') }; await pick('qa_lr_type', 'Partner'); R.createPartner = { btn: await has('QA LR1112 btn'), link: await has('QA LR1112 link') };
  // F5: map dependency + filter
  await openCreate(mid, lid); await pick('qa_lr_type', 'Refund'); R.F5_depOnly = (await options('qa_lr_tier')).filter(s => /Gold|Silver|Bronze/.test(s)); await pick('qa_lr_filter', 'X'); R.F5_both = (await options('qa_lr_tier')).filter(s => /Gold|Silver|Bronze/.test(s)); await shot('crm-F5');
  // H6: order 'BAD1' with Refund
  await typeIn('first_name', 'QA LR1112 rec H6'); await typeIn('qa_lr_order', ''); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3000); R.H6_empty = await errs();
  await typeIn('qa_lr_order', 'BAD1'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3500); if (await page.getByText('Verify these values').count()) { await page.getByRole('button', { name: /^Continue$/ }).click(); await sleep(3500); } R.H6_bad = await errs(); R.H6_url = page.url().slice(-30); R.H6_txt = ((await bodyText()).match(/[^.]{0,30}BAD[^.]{0,60}/g) || []).slice(0, 3); await shot('crm-H6');
  return R; }
