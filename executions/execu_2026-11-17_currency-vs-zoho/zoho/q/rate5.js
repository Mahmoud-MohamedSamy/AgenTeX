async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const before = await page.innerText('body');
  await page.mouse.click(540, 94); await page.waitForTimeout(4000);
  await page.screenshot({ path: R + 'z33-trends.png' });
  let t = await page.innerText('body'); out.trends = t.slice(t.lastIndexOf('Exchange Rate Trends')).slice(0, 1200);
  await page.mouse.click(664, 94); await page.waitForTimeout(4000);
  await page.screenshot({ path: R + 'z34-logs.png' });
  t = await page.innerText('body'); out.logs = t.slice(t.lastIndexOf('Exchange Rate Trends')).slice(0, 1500);
  return out;
}
