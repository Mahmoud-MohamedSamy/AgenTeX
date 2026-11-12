async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(639, 208); await page.waitForTimeout(1000);
  await page.screenshot({ path: O + 'c17a.png' });
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const box = f.locator('input[placeholder="Enter comma separated values"]:visible').first();
  const bb = await box.boundingBox().catch(() => null);
  if (bb) { await box.click(); } else { await page.mouse.click(920, 715); }
  await page.keyboard.type('QA C3 WF'); await page.waitForTimeout(800);
  await page.screenshot({ path: O + 'c17b.png' });
  return { bb };
}
