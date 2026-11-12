async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(10000);
  await page.mouse.click(95, 789); await page.waitForTimeout(8000);
  let ok = false;
  for (let k = 0; k < 3 && !ok; k++) {
    const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
    const t = f ? await f.locator('body').innerText().catch(() => '') : '';
    if (/Closing a ticket/.test(t)) { ok = true; break; }
    await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(20000);
  }
  await page.screenshot({ path: O + 'c32.png' });
  return { ok, url: page.url() };
}
