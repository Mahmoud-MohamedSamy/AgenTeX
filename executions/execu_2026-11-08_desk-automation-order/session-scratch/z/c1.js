async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(9000);
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url())) || page.mainFrame();
  const l = f.locator('text="Notification Rules"');
  if (await l.count()) { await l.first().click(); await page.waitForTimeout(6000); }
  else { const n = f.locator('text="Notifications"'); if (await n.count()) { await n.first().click(); await page.waitForTimeout(2000); await f.locator('text="Notification Rules"').first().click().catch(() => {}); await page.waitForTimeout(6000); } }
  await page.screenshot({ path: O + 'c1.png' });
  return page.url();
}
