async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.mouse.click(340, 311); await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z21-add-module.png' });
  const t = await page.innerText('body'); out.dlg = t.slice(t.lastIndexOf('Help') - 50).slice(0, 2500);
  const dd = page.locator('lyte-dropdown:visible'); out.dd = await dd.count();
  if (out.dd) { await dd.first().click(); await page.waitForTimeout(1500); out.modules = await page.locator('lyte-drop-item:visible').allInnerTexts(); await page.keyboard.press('Escape'); }
  return out;
}
