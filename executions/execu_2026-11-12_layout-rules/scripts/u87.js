async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  for (const [k, id] of [['partner', '2ca6bc00-4cbd-4d73-9f0c-08805e783556'], ['question', 'b0820d1f-bf72-4699-b121-0c2dbf0458a9']]) { await openRec(mid, id); R[k] = await page.getByText('QA LR1112 btn').count(); await shot('crm-F22-' + k); }
  await page.goto(HOST + '/modules/' + mid + '/records', { waitUntil: 'domcontentloaded' }); await sleep(6000); R.list = await page.getByText('QA LR1112 btn').count();
  return R; }
