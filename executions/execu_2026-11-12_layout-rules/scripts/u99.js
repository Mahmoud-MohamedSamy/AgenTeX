async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await openRec(mid, 'c10b2d37-1d12-406a-b7bc-8f9f3480f721'); await sleep(2000);
  const tb = page.getByRole('button', { name: 'QA to Refund' }).first(); R.tb = await tb.count(); if (!R.tb) { R.btns = (await page.getByRole('button').allInnerTexts()).filter(s => /QA|Refund|transition/i.test(s)); return R; }
  await tb.click(); await sleep(2500); const d = page.locator('[role=dialog]').first(); R.dlg = await d.count(); if (R.dlg) { R.dlgTxt = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500); R.orderInDlg = /QA LR1112 order/.test(R.dlgTxt); } await shot('crm-G10-dialog');
  if (R.dlg) { const sub = d.getByRole('button', { name: /Save|Submit|Complete|Continue|Confirm/i }).last(); await sub.click(); await sleep(3000); R.afterSubmit = ((await bodyText()).match(/[^.]{0,40}(required|completed|moved|updated|error)[^.]{0,80}/gi) || []).slice(0, 4); R.dlgStill = await page.locator('[role=dialog]').count(); await shot('crm-G10-submit'); }
  return R; }
