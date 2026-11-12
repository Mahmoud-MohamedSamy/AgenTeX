async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.waitForTimeout(5000);
  let f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  let txt = f ? (await f.locator('body').innerText().catch(() => '')).slice(0, 1500) : 'noframe';
  if (!/Closing a ticket/.test(txt)) { await page.mouse.click(86, 536); await page.waitForTimeout(8000);
    f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
    txt = f ? (await f.locator('body').innerText().catch(() => '')).slice(0, 1500) : 'noframe'; }
  await page.screenshot({ path: O + 'c3.png' });
  return txt;
}
