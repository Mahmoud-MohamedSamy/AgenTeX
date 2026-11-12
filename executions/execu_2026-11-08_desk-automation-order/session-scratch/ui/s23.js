const { openEditor } = require('./lib-ed');
const NL = String.fromCharCode(10);
module.exports = async (h) => {
  const { page, go, shot, log } = h;
  await go('/settings/automation/actions'); await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'New Action' }).first().click(); await page.waitForTimeout(1000);
  const dlg = page.getByRole('dialog').first();
  await dlg.getByText('Field Update', { exact: true }).first().click(); await page.waitForTimeout(400);
  await dlg.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(1200);
  log('K4_url', page.url()); const host = (await page.getByRole('dialog').count()) ? page.getByRole('dialog').first() : page.locator('main').last();
  log('K4_form', (await host.innerText()).split(NL).filter(Boolean).slice(0, 25));
  const save = host.getByRole('button', { name: /^(Save|Create)/ }).last();
  log('K4_saveDisabled', await save.isDisabled().catch(() => 'no save'));
  if (await save.count() && !(await save.isDisabled())) { await save.click(); await page.waitForTimeout(1500); }
  log('K4_errors', (await host.innerText().catch(() => 'closed')).split(NL).filter(l => /required|name|pick|select|must|fill|add at least/i.test(l)).slice(0, 8));
  log('K4_toasts', await page.locator('[data-sonner-toast]').allInnerTexts());
  await shot('s23-k4', { full: true }); await page.keyboard.press('Escape');
  // K8 + F20 + F22 in the editor
  await openEditor(h, 'QA AO WF K8 editor', 'Create');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
  await clk(main.getByRole('button', { name: /^Field Update/ }).first()); await page.waitForTimeout(800);
  await clk(main.getByText('Use a saved action', { exact: true }).first()); await page.waitForTimeout(600);
  await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(1500);
  log('F22_emptySlot', ((await main.innerText()).split('Fix these before saving:')[1] || 'none').split(NL).filter(Boolean).slice(0, 4));
  const pick = main.locator('button').filter({ hasText: /Pick a saved action|Select a saved action|Choose/ }).first();
  await pick.click({ force: true }); await page.waitForTimeout(800);
  log('F20_options', (await page.locator('xpath=//*[@role="option"]').allInnerTexts()).map(x => x.split(NL)[0]));
  const k8 = page.locator('xpath=//*[@role="option"][contains(normalize-space(.),"QA AO WF K8 inactive")]').first();
  if (await k8.count()) { await k8.click(); await page.waitForTimeout(800); }
  log('K8_F20_texts', ((await main.innerText()).split('Instant actions')[1] || '').split(NL).filter(l => /inactive|skipped|resolves live|saved|library/i.test(l)).slice(0, 6));
  await shot('s23-k8', { full: true });
};
