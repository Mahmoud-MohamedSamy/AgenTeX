const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  const posts = []; page.on('request', r => { if (/\/workflow\/rules$/.test(r.url()) && r.method() === 'POST') posts.push((r.postData() || '').match(/"criteria":\{.{0,400}/)?.[0]); });
  await openEditor(h, 'QA AO WF BH P11 screen', 'Create');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  await L.openConditions();
  await clk(main.locator('button[aria-label="— select field —"]').first()); await page.waitForTimeout(600);
  const s = page.locator('[cmdk-input], input[placeholder*="Search"]').last(); if (await s.count()) { await s.fill('Execution'); await page.waitForTimeout(600); }
  log('fieldOpts', await page.getByRole('option').allInnerTexts());
  await page.getByRole('option').filter({ hasText: /Execution Time/ }).first().click(); await page.waitForTimeout(800);
  const row = main.locator('button[aria-label="Remove condition"]').first().locator('xpath=..');
  log('rowText', (await row.innerText()).split('\n').filter(Boolean));
  await clk(main.getByRole('button', { name: 'Operator' }).first()); await page.waitForTimeout(500); log('ops', await page.getByRole('option').allInnerTexts()); await page.keyboard.press('Escape');
  const vb = row.getByRole('button').filter({ hasNotText: /Execution|Remove|is/ }); log('valueButtons', await vb.allInnerTexts());
  await vb.first().click({ force: true }); await page.waitForTimeout(500); await page.getByRole('option', { name: 'During business hours' }).click(); await page.waitForTimeout(400); await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600); await clk(main.getByRole('button', { name: /^Add comment/i }).first()); await page.waitForTimeout(800); const ed = main.locator('[contenteditable=true]').last(); await ed.click(); await page.keyboard.type('QA AO WF P11 screen fired'); await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(4000); log('posts', posts); log('url', page.url().slice(-40));
  await shot('p11-editor');
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
};
