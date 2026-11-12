async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(870, 580); await page.waitForTimeout(800);
  await page.mouse.click(505, 645); await page.waitForTimeout(3500);
  await page.screenshot({ path: O + 'c23a.png' });
  await page.mouse.click(325, 842); await page.waitForTimeout(5000);
  await page.screenshot({ path: O + 'c23b.png' });
  return page.url();
}
