async (page) => { const R = {}; await page.getByRole('button', { name: 'Negotiation', exact: true }).first().click(); await sleep(3000);
  R.dlg = await page.locator('[role=dialog],[role=alertdialog]').count(); if (R.dlg) R.dlgTxt = (await page.locator('[role=dialog],[role=alertdialog]').first().innerText()).replace(/\s+/g, ' ').slice(0, 400);
  R.toast = ((await bodyText()).match(/[^.]{0,40}(required|updated|saved|approval note)[^.]{0,80}/gi) || []).slice(0, 4); await shot('crm-G9'); return R; }
