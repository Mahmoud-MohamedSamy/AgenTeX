async (page) => { const R = {}; await page.locator('[role=dialog]').getByRole('button', { name: 'Execute' }).click(); await sleep(4000);
  R.dlgStill = await page.locator('[role=dialog]').count(); R.msgs = ((await bodyText()).match(/[^.]{0,50}(required|completed|moved|executed|error|could not)[^.]{0,100}/gi) || []).slice(0, 4); await shot('crm-G10-submit'); return R; }
