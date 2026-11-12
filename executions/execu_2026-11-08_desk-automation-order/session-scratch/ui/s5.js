module.exports = async ({ page, go, shot, log }) => {
  const count = async () => (await page.getByRole('tab').first().innerText()).replace(/\D/g, '');
  await go('/settings/automation/workflow-rules'); await page.getByRole('row').nth(3).waitFor();
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
  const before = await count(); const dlg = () => page.getByRole('dialog').first();
  await page.getByRole('button', { name: 'New Rule' }).click(); await dlg().waitFor();
  // C3
  log('C3_nextDisabledEmpty', await dlg().getByRole('button', { name: 'Next' }).isDisabled());
  log('C3_errors', (await dlg().innerText()).split('\n').filter(l => /pick|give|required|name|module/i.test(l))); await shot('s5-c3');
  // C1 cancel + escape
  await dlg().getByRole('button', { name: 'Cancel' }).click(); await page.waitForTimeout(500); log('C1_closedByCancel', !(await page.getByRole('dialog').count()));
  await page.getByRole('button', { name: 'New Rule' }).click(); await dlg().waitFor(); await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  log('C1_closedByEsc', !(await page.getByRole('dialog').count())); log('C1_countSame', before === await count());
  // C4 length
  await page.getByRole('button', { name: 'New Rule' }).click(); await dlg().waitFor();
  const name = dlg().getByPlaceholder('e.g. High-Value Lead Notification');
  log('C4_maxlength', await name.getAttribute('maxlength'));
  await name.fill('x'.repeat(1000)); log('C4_len1000', (await name.inputValue()).length);
  await name.fill('   '); await dlg().getByRole('button', { name: 'Select a module' }).click(); await page.waitForTimeout(500);
  log('C2_modules', await page.getByRole('option').allInnerTexts()); await page.getByRole('option', { name: 'Tickets' }).click(); await page.waitForTimeout(500);
  log('C4_nextDisabledSpacesOnly', await dlg().getByRole('button', { name: 'Next' }).isDisabled());
  log('C4_spacesOnly', (await dlg().innerText().catch(() => 'dialog gone')).split('\n').filter(l => /name|give|required/i.test(l)));
  // C8 layout
  await dlg().getByRole('button', { name: 'Layout' }).click(); await page.waitForTimeout(500);
  log('C8_layouts', await page.getByRole('option').allInnerTexts());
  const std = page.getByRole('option', { name: 'Standard' }); if (await std.count()) { await std.click(); await page.waitForTimeout(500); }
  log('C8_hint', (await dlg().innerText()).split('\n').filter(l => /layout/i.test(l)));
  await shot('s5-c8');
  // C10
  await name.fill('QA AO WF C10 wizard'); await dlg().getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(1500);
  log('C10_next', await page.getByRole('dialog').count() ? await dlg().innerText() : 'dialog closed, url ' + page.url());
  await shot('s5-c10');
};
