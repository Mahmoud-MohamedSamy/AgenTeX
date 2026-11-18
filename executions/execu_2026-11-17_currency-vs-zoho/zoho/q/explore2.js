async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const dlg = async () => (await page.innerText('body')).split('Contacts').slice(1).join('Contacts').replace(/\s+\n/g, '\n').slice(0, 2500);
  await page.locator(':text-is("Yes, Continue"):visible').first().click(); await page.waitForTimeout(3500);
  await page.screenshot({ path: R + 'z07-add-form.png' });
  return await dlg();
}
