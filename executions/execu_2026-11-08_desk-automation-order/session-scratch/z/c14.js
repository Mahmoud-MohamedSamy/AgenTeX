async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(333, 168); await page.waitForTimeout(600);
  await page.mouse.click(325, 842); await page.waitForTimeout(3500);
  await page.screenshot({ path: O + 'c14.png' });
  return 'ok';
}
