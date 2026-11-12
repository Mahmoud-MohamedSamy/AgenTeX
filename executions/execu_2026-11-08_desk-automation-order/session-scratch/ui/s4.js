module.exports = async ({ page, go, shot, log }) => {
  await go('/settings/automation/workflow-rules'); await page.getByRole('row').nth(3).waitFor();
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
  await page.getByRole('button', { name: 'New Rule' }).click(); await page.waitForTimeout(1500);
  log('C1_dialog', await page.getByRole('dialog').first().innerText().catch(() => 'no dialog')); await shot('s4-wizard');
  log('C1_fields', await page.getByRole('dialog').first().locator('input,textarea,select,button,[role=combobox]').evaluateAll(e => e.map(x => [x.tagName, x.getAttribute('placeholder') || x.getAttribute('aria-label') || x.innerText.slice(0, 30)].join('|'))).catch(() => []));
};
