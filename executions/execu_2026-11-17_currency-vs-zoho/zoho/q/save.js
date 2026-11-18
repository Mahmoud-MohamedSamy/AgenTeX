async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.mouse.click(1050, 643); await page.waitForTimeout(5000);
  await page.screenshot({ path: R + 'z15-list.png' });
  const t = await page.innerText('body'); return t.slice(t.indexOf('Hierarchy Preference')).slice(0, 2500);
}
