async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.mouse.click(880, 506); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await page.keyboard.type('0.02'); await page.waitForTimeout(600);
  await page.mouse.click(1028, 579); await page.waitForTimeout(3500);
  await page.screenshot({ path: R + 'z31-after-rate-save.png' });
  let t = await page.innerText('body'); out.after = t.slice(t.lastIndexOf('Help') - 600).slice(0, 1500);
  return out;
}
