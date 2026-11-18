async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.locator(':text-is("Yes, Confirm Home Currency"):visible').first().click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: R + 'z03-after-confirm-click.png' });
  let t = await page.innerText('body');
  return t.slice(Math.max(0, t.indexOf('Hierarchy Preference'))).slice(0, 3000);
}
