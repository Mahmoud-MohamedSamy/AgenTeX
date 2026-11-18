async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.mouse.click(249, 255);
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); const c = page.locator(':text-is("Currencies"):visible'); if (await c.count()) break; }
  await page.locator(':text-is("Currencies"):visible').first().click();
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); const t = await page.innerText('body'); if (/Home Currency/i.test(t)) break; }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z01-currencies.png' });
  const t = await page.innerText('body');
  return { url: page.url(), text: t.slice(Math.max(0, t.indexOf('Currencies') - 300)).slice(0, 4500) };
}
