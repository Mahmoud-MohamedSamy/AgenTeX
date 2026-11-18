async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.mouse.click(240 + 1317, 50 + 35); await page.waitForTimeout(1500);
  const d = page.locator(':text-is("Delete"):visible'); out.del = await d.count();
  if (!out.del) { await page.screenshot({ path: R + 'z41-menu.png' }); return out; }
  await d.first().click(); await page.waitForTimeout(2000);
  let t = await page.innerText('body'); out.prompt = t.slice(t.lastIndexOf('Help')).slice(0, 500);
  await page.screenshot({ path: R + 'z41-delete-prompt.png' });
  return out;
}
