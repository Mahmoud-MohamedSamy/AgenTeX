async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(637, 222); await page.keyboard.type('QA C3 set Closed'); await page.waitForTimeout(300);
  await page.mouse.click(630, 450); await page.waitForTimeout(1000);
  await page.keyboard.type('Status'); await page.waitForTimeout(800); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
  await page.screenshot({ path: O + 'c22a.png' });
  await page.mouse.click(1010, 450); await page.waitForTimeout(1000);
  await page.screenshot({ path: O + 'c22b.png' });
  return 'ok';
}
