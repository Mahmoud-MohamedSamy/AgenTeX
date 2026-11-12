async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.screenshot({ path: O + 'c34a.png' });
  await page.mouse.click(95, 789); await page.waitForTimeout(6000);
  const u1 = page.url();
  if (/notifyrules/.test(u1)) { await page.reload({ waitUntil: 'commit', timeout: 90000 }).catch(() => {}); await page.waitForTimeout(25000); }
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const t = f ? await f.locator('body').innerText().catch(() => '') : '';
  await page.screenshot({ path: O + 'c34.png' });
  return { u1, ok: /Closing a ticket/.test(t) };
}
