async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(702, 296); await page.waitForTimeout(4000);
  await page.screenshot({ path: O + 'c5.png' });
  return 'ok';
}
