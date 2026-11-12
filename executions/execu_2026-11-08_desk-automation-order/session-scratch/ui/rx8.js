module.exports = async (h) => {
  const { page, shot, log, go } = h;
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
  await go('/settings/automation/workflow-rules'); await page.waitForTimeout(1500);
  const link = page.getByRole('button', { name: 'Custom Actions', exact: true }).first();
  if (await link.count()) { await link.click(); await page.waitForTimeout(3000); }
  log('url', page.url().replace(/^https:\/\/[^/]+/, ''));
  log('text', (await page.locator('main').last().innerText()).split('Email Providers').pop().slice(0, 1500));
  log('buttons', (await page.locator('main').last().getByRole('button').allInnerTexts()).filter(Boolean).slice(45, 80));
  await shot('rx-p22-page');
};
