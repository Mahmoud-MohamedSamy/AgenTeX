async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(375, 668); await page.waitForTimeout(9000);
  await page.screenshot({ path: O + 'w4.png' });
  return { url: page.url(), text: (await page.locator('body').innerText()).replace(/\n{2,}/g, '\n').slice(0, 1500) };
}
