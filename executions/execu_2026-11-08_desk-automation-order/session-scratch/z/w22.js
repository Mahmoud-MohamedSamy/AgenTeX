async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(630, 450); await page.waitForTimeout(1200);
  await page.screenshot({ path: O + 'w22-fields.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.mouse.click(613, 645); await page.waitForTimeout(1200);   // Cancel the field update dialog
  await page.mouse.click(433, 842); await page.waitForTimeout(2500);   // Cancel the new rule
  await page.screenshot({ path: O + 'w22-after.png' });
  return page.url();
}
