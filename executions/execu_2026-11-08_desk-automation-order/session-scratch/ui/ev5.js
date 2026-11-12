module.exports = async ({ page, go, shot, log }) => {
  await go('/settings/automation/workflow-rules'); await page.getByRole('row').nth(2).waitFor().catch(() => {});
  await page.locator('input[placeholder^="Search rules"]').first().fill('QA AO WF EV10'); await page.waitForTimeout(2500);
  log('rows', (await page.getByRole('row').allInnerTexts()).filter(r => /EV10/.test(r)));
  await shot('ev-d10-two-rules');
};
