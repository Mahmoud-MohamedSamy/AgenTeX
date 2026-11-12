async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(95, 789); await page.waitForTimeout(4000);
  await page.screenshot({ path: O + 'c2a.png' });
  const t = await page.locator('text=/Notification Rules/').count();
  if (t) { await page.locator('text=/Notification Rules/').first().click().catch(() => {}); await page.waitForTimeout(6000); }
  await page.screenshot({ path: O + 'c2.png' });
  return { url: page.url(), frames: page.frames().map(f => f.url().slice(0, 120)) };
}
