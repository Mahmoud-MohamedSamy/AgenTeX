async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const before = new Set((await page.innerText('body')).split('\n'));
  await page.mouse.click(834, 97); await page.waitForTimeout(1500);
  out.modules = (await page.innerText('body')).split('\n').filter(l => l.trim() && !before.has(l)).slice(0, 30);
  // pick Deals to see the condition options
  const d = page.getByText('Deals', { exact: true }); if (await d.count()) { await d.last().click(); await page.waitForTimeout(2500); }
  await page.screenshot({ path: R + 'z22-auto-module-deals.png' });
  const t = await page.innerText('body'); out.form = t.slice(t.indexOf('Exchange Rate Auto Update Preferences')).slice(0, 1500);
  return out;
}
