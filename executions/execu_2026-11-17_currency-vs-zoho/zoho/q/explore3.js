async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const dlg = async () => (await page.innerText('body')).split('Contacts').slice(1).join('Contacts').replace(/\s+\n/g, '\n').slice(0, 3000);
  await page.locator(':text-is("None"):visible').first().click(); await page.waitForTimeout(2000);
  const opts = await page.locator('lyte-drop-item:visible').allInnerTexts();
  await page.keyboard.type('Euro'); await page.waitForTimeout(1500);
  await page.screenshot({ path: R + 'z08-currency-picker.png' });
  const e = page.locator('lyte-drop-item:visible', { hasText: 'Euro' }); if (await e.count()) await e.first().click(); await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z09-add-euro.png' });
  return { optCount: opts.length, first: opts.slice(0, 8), form: await dlg() };
}
