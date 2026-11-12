async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(470, 764); await page.waitForTimeout(800); await page.keyboard.type('Subject', { delay: 40 }); await page.waitForTimeout(900); await page.keyboard.press('Enter'); await page.waitForTimeout(900);
  await page.mouse.click(920, 764); await page.keyboard.type('zz2'); await page.keyboard.press('Tab');
  await page.mouse.click(1097, 764); await page.waitForTimeout(1200);
  await page.mouse.move(800, 500); await page.mouse.wheel(0, 400); await page.waitForTimeout(1000);
  await page.screenshot({ path: O + 'w13.png' });
  return 'ok';
}
