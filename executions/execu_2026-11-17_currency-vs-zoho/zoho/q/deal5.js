async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.mouse.click(654, 295, { clickCount: 3 }); await page.keyboard.press('Backspace');
  await page.mouse.click(831, 295); await page.waitForTimeout(4000);
  await page.screenshot({ path: R + 'z27c-account-picker.png' });
  const t = await page.innerText('body'); const i = t.lastIndexOf('Choose Account'); return t.slice(i >= 0 ? i : t.length - 1500).slice(0, 1500);
}
