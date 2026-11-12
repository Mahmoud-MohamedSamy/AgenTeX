async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(635, 680); await page.waitForTimeout(800);
  await page.mouse.click(920, 484); await page.keyboard.type('QA C3 WF'); await page.keyboard.press('Tab'); await page.waitForTimeout(600);
  await page.screenshot({ path: O + 'c16a.png' });
  await page.mouse.click(325, 842); await page.waitForTimeout(3500);
  await page.screenshot({ path: O + 'c16.png' });
  return 'ok';
}
