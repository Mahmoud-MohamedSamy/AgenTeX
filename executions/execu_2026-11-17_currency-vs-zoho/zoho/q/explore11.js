async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const before = new Set((await page.innerText('body')).split('\n'));
  await page.getByText('When the record is edited.', { exact: true }).first().click(); await page.waitForTimeout(1500);
  out.opts = (await page.innerText('body')).split('\n').filter(l => l.trim() && !before.has(l)).slice(0, 20);
  await page.screenshot({ path: R + 'z23-auto-when.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  await page.locator(':text-is("Cancel"):visible').last().click(); await page.waitForTimeout(1500);
  await page.mouse.click(295, 271); await page.waitForTimeout(2500);
  const t = await page.innerText('body'); out.after = t.slice(t.indexOf('Exchange Rate Update For Records'), t.indexOf('My Pins'));
  await page.screenshot({ path: R + 'z24-prefs-restored.png' });
  return out;
}
