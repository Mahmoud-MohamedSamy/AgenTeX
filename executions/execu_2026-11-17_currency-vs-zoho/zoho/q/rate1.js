async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.goto('https://crm.zoho.com/crm/org946877290/settings/index', { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); if (await page.locator(':text-is("Company Settings"):visible').count()) break; }
  await page.locator(':text-is("Company Settings"):visible').first().click();
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); if (await page.locator(':text-is("Currencies"):visible').count()) break; }
  await page.locator(':text-is("Currencies"):visible').first().click();
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); if (await page.locator(':text-is("Euro - EUR"):visible').count()) break; }
  await page.locator(':text-is("Euro - EUR"):visible').first().click(); await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z29-edit-euro.png' });
  const t = await page.innerText('body'); out.dlg = t.slice(t.lastIndexOf('Edit Euro')).slice(0, 1200);
  return out;
}
