async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(470, 714); await page.waitForTimeout(1000);
  await page.screenshot({ path: O + 'w11a.png' });
  await page.keyboard.type('Subject', { delay: 40 }); await page.waitForTimeout(1000);
  await page.screenshot({ path: O + 'w11b.png' });
  await page.keyboard.press('Enter'); await page.waitForTimeout(1200);
  await page.screenshot({ path: O + 'w11c.png' });
  return 'ok';
}
