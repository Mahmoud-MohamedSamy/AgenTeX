async (page, ctx) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const open = async p => { await p.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await p.locator('tr', { hasText: 'QA LR1112 I1 dbl' }).locator('button').nth(1).click(); await p.waitForTimeout(4000); };
  const p2 = await ctx.newPage(); await open(page); await open(p2);
  await page.locator('textarea').first().fill('tab1 edit'); await page.locator('main button', { hasText: /^Save$/ }).first().click(); await page.waitForTimeout(4000); R.t1 = page.url().slice(-20);
  await p2.locator('textarea').first().fill('tab2 edit'); await p2.locator('main button', { hasText: /^Save$/ }).first().click(); await p2.waitForTimeout(4000);
  R.t2url = p2.url().slice(-20); const t = (await p2.innerText('body')).replace(/\s+/g, ' '); R.t2msg = (t.match(/[^.]{0,80}(changed|conflict|version|someone|reload|could not)[^.]{0,120}/gi) || []).slice(0, 3);
  await p2.screenshot({ path: EV + 'crm-I2.png' }); await p2.close();
  return R; }
