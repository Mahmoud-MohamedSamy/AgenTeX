async (page) => { const R = {}; await page.locator('[role=menuitem],[role=option]', { hasText: /^Leads$/ }).first().click(); await sleep(4000);
  R.url = page.url().slice(-80); R.dialog = await page.locator('[role=dialog]').count(); const scope = R.dialog ? page.locator('[role=dialog]').first() : page.locator('main');
  R.layoutTxt = (await scope.innerText()).replace(/\s+/g, ' ').slice(0, 400); R.ruleFields = await page.locator('[data-rule-field]').count(); await shot('crm-G5');
  return R; }
