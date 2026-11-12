const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF F forms', 'Create');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  const actText = async () => ((await main.innerText()).split('Instant actions')[1] || '').split('Scheduled actions')[0];
  const forms = {};
  for (const t of ['Webhook', 'Email', 'Task', 'Create Record', 'Remove Tags', 'Send happiness email', 'Owner Assignment']) {
    await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
    const b = main.getByRole('button', { name: new RegExp('^' + t) }).first();
    if (!(await b.count())) { forms[t] = 'not offered'; await clk(main.getByRole('button', { name: 'Close' }).first()).catch(() => {}); continue; }
    await clk(b); await page.waitForTimeout(800);
  }
  const all = await actText();
  log('F_formsText', all.split('\n').filter(Boolean).slice(0, 140));
  await shot('s16-forms', { full: true });
  // saved action slot empty (F22)
  await clk(main.getByRole('button', { name: 'Or use a saved action' }).first()).catch(() => {}); await page.waitForTimeout(600);
  log('F20_savedPicker', (await page.locator('[role=option], [role=menuitem]').allInnerTexts()).slice(0, 10));
  await page.keyboard.press('Escape');
  await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(1500);
  log('F_saveErrors', ((await main.innerText()).split('Fix these before saving:')[1] || 'none').split('\n').filter(Boolean).slice(0, 20));
  // Owner assignment tabs F8
  log('F8_ownerTexts', all.split('\n').filter(l => /Users|Roles|User Fields|round-robin|round robin/i.test(l)).slice(0, 6));
  const roles = main.getByText('Roles', { exact: true }).last();
  if (await roles.count()) { await clk(roles); await page.waitForTimeout(600); const sel = main.locator('button').filter({ hasText: /^Select/ }).last(); if (await sel.count()) { await sel.click({ force: true }); await page.waitForTimeout(600); log('F8_roles', await page.locator('[role=option]').allInnerTexts()); await page.keyboard.press('Escape'); } }
  // Webhook methods F9
  const meth = main.locator('button, select').filter({ hasText: /^POST$/ }).first();
  if (await meth.count()) { await meth.click({ force: true }); await page.waitForTimeout(500); log('F9_methods', await page.locator('[role=option]').allInnerTexts()); await page.keyboard.press('Escape'); }
};
