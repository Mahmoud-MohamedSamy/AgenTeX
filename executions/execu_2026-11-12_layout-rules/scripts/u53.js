async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.locator('main button', { hasText: /^Choose…$/ }).first().click(); await sleep(800); const o = page.getByRole('option', { name: 'QA LR1112 date', exact: true }); if (await o.count()) await o.first().click(); else { const c = page.locator('[role=option]', { hasText: 'QA LR1112 date' }); await c.first().click(); } await sleep(600); await page.keyboard.press('Escape'); await sleep(400);
  const sv = page.locator('main button', { hasText: /^Save$/ }).first(); await sv.dblclick(); await sleep(300); await sv.click({ timeout: 2000 }).catch(() => {}); await sleep(5000);
  R.url = page.url().slice(-40); R.msg = ((await bodyText()).match(/(saved|could not|already|error)[^.]{0,120}/gi) || []).slice(0, 3);
  const g = await page.evaluate(async mid => { const r = await fetch('/api/v1/modules/' + mid + '/layout-rules?layoutId=3847cbd4-508c-4402-9602-e63a72a0f1d7'); return r.status + ' ' + (await r.text()).slice(0, 100); }, mid); R.apiProbe = g.slice(0, 60);
  return R; }
