async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const n = await page.evaluate(() => [...document.querySelectorAll('input[type=checkbox]')].filter(e => e.checked).length);
  const b = page.locator('button:visible, lyte-button:visible, input[type=button]:visible', { hasText: /^Delete$/ });
  const bb = await b.boundingBox().catch(() => null);
  await page.screenshot({ path: R + 'z44-purge-prompt.png' });
  return { checkedBoxes: n, btn: bb };
}
