async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.locator(':text-is("Yes, Deactivate"):visible').first().click(); await page.waitForTimeout(4000);
  await page.screenshot({ path: R + 'z37-deactivated.png' });
  const t = await page.innerText('body'); return { row: t.slice(t.indexOf('Currency Name'), t.indexOf('Only 5')).replace(/\s+/g, ' '), toast: t.slice(t.lastIndexOf('Help')).slice(0, 200) };
}
