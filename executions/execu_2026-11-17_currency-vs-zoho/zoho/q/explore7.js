async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const tail = async () => { const t = await page.innerText('body'); return t.slice(t.indexOf('Only 5 currencies')).slice(0, 1500); };
  await page.mouse.move(1067, 460); await page.waitForTimeout(1800);
  await page.screenshot({ path: R + 'z16-rate-info.png' }); out.rateInfo = await tail();
  await page.mouse.move(700, 460); await page.waitForTimeout(1200);
  await page.screenshot({ path: R + 'z17-row-hover.png' });
  await page.mouse.click(1490, 415); await page.waitForTimeout(1500);
  out.statusFilter = await page.locator('lyte-drop-item:visible').allInnerTexts();
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  await page.mouse.click(520, 158); await page.waitForTimeout(3500);
  await page.screenshot({ path: R + 'z18-rate-prefs.png' });
  const t = await page.innerText('body'); out.prefs = t.slice(t.indexOf('Exchange Rate Preferences')).slice(0, 2500);
  return out;
}
