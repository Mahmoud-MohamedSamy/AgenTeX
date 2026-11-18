async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.locator(':text-is("Change Home Currency"):visible').first().click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: R + 'z02-change-home.png' });
  const t = await page.innerText('body');
  return t.slice(Math.max(0, t.indexOf('Hierarchy Preference'))).slice(0, 2500);
}
