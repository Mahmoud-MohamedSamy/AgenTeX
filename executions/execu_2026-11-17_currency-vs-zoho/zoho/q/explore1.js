async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const dlg = async () => (await page.innerText('body')).split('Contacts').slice(1).join('Contacts').replace(/\s+\n/g, '\n').slice(0, 1800);
  await page.screenshot({ path: R + 'z04-home-confirmed.png' });
  await page.locator(':text-is("Edit"):visible').first().click(); await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z05-edit-home.png' }); out.editHome = await dlg();
  await page.locator(':text-is("Cancel"):visible').last().click(); await page.waitForTimeout(2000);
  await page.locator(':text-is("Add Currency"):visible').first().click(); await page.waitForTimeout(3500);
  await page.screenshot({ path: R + 'z06-add-currency.png' }); out.add = await dlg();
  return out;
}
