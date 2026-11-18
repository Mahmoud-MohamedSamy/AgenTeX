async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.mouse.click(1333, 241); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await page.waitForTimeout(1200);
  const cell = page.locator('lyte-calendar:visible .lyteCalCdate, lyte-calendar:visible [class*=Date]:visible', { hasText: /^28$/ });
  out.cells = await cell.count();
  if (out.cells) await cell.last().click(); await page.waitForTimeout(1200);
  await page.screenshot({ path: R + 'z27-deal-filled.png' });
  const t0 = await page.innerText('body'); out.date = t0.slice(t0.indexOf('Closing Date'), t0.indexOf('Closing Date') + 80).replace(/\n/g, ' | ');
  return out;
}
