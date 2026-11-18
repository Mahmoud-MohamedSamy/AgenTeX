async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.goto('https://crm.zoho.com/crm/org946877290/settings/index', { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); if (await page.locator(':text-is("Company Settings"):visible').count()) break; }
  await page.locator(':text-is("Company Settings"):visible').first().click();
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); if (await page.locator(':text-is("Currencies"):visible').count()) break; }
  await page.locator(':text-is("Currencies"):visible').first().click();
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); if (await page.locator('[data-zcqa="currView_EUR"]:visible').count()) break; }
  await page.waitForTimeout(1500);
  await page.mouse.click(1437, 460); await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z36-deactivate-prompt.png' });
  const t = await page.innerText('body'); out.prompt = t.slice(t.lastIndexOf('Help')).slice(0, 900);
  return out;
}
