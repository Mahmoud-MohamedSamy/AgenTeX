async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.mouse.click(1333, 511); await page.waitForTimeout(1500);
  out.currencyOpts = await page.locator('lyte-drop-item:visible').allInnerTexts();
  const e = page.locator('lyte-drop-item:visible', { hasText: 'EUR' }); if (await e.count()) await e.first().click(); await page.waitForTimeout(2000);
  await page.mouse.click(1340, 187); await page.keyboard.type('1000'); await page.waitForTimeout(800);
  await page.mouse.move(1511, 187); await page.waitForTimeout(1500);
  out.amountTip = (await page.locator('lyte-popover:visible, lyte-tooltip:visible, [role=tooltip]:visible, .lyteTooltip:visible').allInnerTexts()).join(' | ');
  await page.screenshot({ path: R + 'z26-deal-eur.png' });
  const t = await page.innerText('body'); out.form = t.slice(t.indexOf('Deal Information'), t.indexOf('Description Information'));
  return out;
}
