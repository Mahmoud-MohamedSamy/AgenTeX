module.exports = async ({ page, go, shot, txt, log }) => {
  await go('/settings/automation/workflow-rules'); await page.waitForTimeout(3000);
  log('url', page.url()); log('list', await txt('main', 2500)); await shot('s1-list');
  log('buttons', (await page.locator('main button, main [role=tab], main select, main [role=combobox]').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 40));
  // B5 search no match
  const search = page.getByPlaceholder(/search/i).first();
  if (await search.count()) { await search.fill('zzzz-no-such-rule'); await page.waitForTimeout(1500); log('B5', await txt('main', 600)); await shot('s1-empty-search'); await search.fill(''); }
  // A1 actions library + execution history
  await go('/settings/automation/actions'); await page.waitForTimeout(2500); log('actionsPage', await txt('main', 500));
  await go('/settings/workflow-executions'); await page.waitForTimeout(2500); log('execPage', await txt('main', 500));
};
