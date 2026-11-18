async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const mid = async () => { const t = await page.innerText('body'); return t.slice(t.indexOf('Exchange Rate Update For Records'), t.indexOf('My Pins')).slice(0, 2000); };
  await page.mouse.move(661, 238); await page.waitForTimeout(1500);
  await page.screenshot({ path: R + 'z19-refresh-info.png' });
  out.tip = (await page.locator('lyte-popover:visible, .lyteTooltip:visible, lyte-tooltip:visible, [role=tooltip]:visible').allInnerTexts()).join(' | ');
  await page.mouse.click(295, 271); await page.waitForTimeout(2500);
  await page.screenshot({ path: R + 'z20-auto-update.png' }); out.auto = await mid();
  return out;
}
