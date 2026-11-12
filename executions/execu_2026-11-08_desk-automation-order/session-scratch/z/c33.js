async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.waitForTimeout(15000);
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const t = f ? await f.locator('body').innerText().catch(() => '') : '';
  await page.screenshot({ path: O + 'c33.png' });
  return { ok: /Closing a ticket/.test(t), url: page.url() };
}
