// open the editor for a new Tickets rule through the wizard
module.exports.openEditor = async ({ page, go }, name, trigger = 'Create') => {
  await go('/settings/automation/workflow-rules'); await page.getByRole('row').nth(3).waitFor();
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
  const dlg = page.getByRole('dialog').first();
  await page.getByRole('button', { name: 'New Rule' }).click(); await dlg.waitFor();
  await dlg.getByRole('button', { name: 'Select a module' }).click(); await page.getByRole('option', { name: 'Tickets' }).click();
  await dlg.getByPlaceholder('e.g. High-Value Lead Notification').fill(name);
  await dlg.getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(800);
  if (trigger) await dlg.getByRole('group').getByRole('button', { name: trigger, exact: true }).click();
  await dlg.getByRole('button', { name: 'Create', exact: true }).last().click();
  await page.waitForTimeout(2500);
};
