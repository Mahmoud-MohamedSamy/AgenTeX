async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  for (let k = 0; k < 20; k++) { await page.waitForTimeout(2000); const t = await page.innerText('body'); if (!t.includes('Edit Euro - EUR')) break; }
  await page.screenshot({ path: R + 'z32-after-save.png' });
  let t = await page.innerText('body'); out.list = t.slice(t.indexOf('Currency Name'), t.indexOf('Only 5')).replace(/\s+/g, ' ');
  out.toast = t.slice(t.lastIndexOf('Help')).slice(0, 300);
  await page.locator(':text-is("Euro - EUR"):visible').first().click(); await page.waitForTimeout(3000);
  await page.locator(':text-is("Exchange Rate Trends"):visible').first().click(); await page.waitForTimeout(3500);
  await page.screenshot({ path: R + 'z33-trends.png' });
  t = await page.innerText('body'); out.trends = t.slice(t.lastIndexOf('Exchange Rate Trends')).slice(0, 1200);
  await page.locator(':text-is("Logs"):visible').first().click(); await page.waitForTimeout(3500);
  await page.screenshot({ path: R + 'z34-logs.png' });
  t = await page.innerText('body'); out.logs = t.slice(t.lastIndexOf('Logs')).slice(0, 1500);
  return out;
}
