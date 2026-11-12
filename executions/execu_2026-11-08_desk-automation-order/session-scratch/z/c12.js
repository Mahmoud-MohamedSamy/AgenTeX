async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/1475109000000426945/workflows/rules', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(12000);
  await page.mouse.click(1496, 73); await page.waitForTimeout(5000);
  await page.screenshot({ path: O + 'c12a.png' });
  const f = page.frames().filter(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  let done = false;
  for (const fr of f) { const l = fr.locator('#ruleNameTmp'); if (await l.count() && await l.isVisible().catch(() => false)) { await l.click(); await page.keyboard.type('QA C3 close by workflow'); done = true; break; } }
  await page.waitForTimeout(500);
  await page.screenshot({ path: O + 'c12b.png' });
  return { frames: f.length, typed: done };
}
