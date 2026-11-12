async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await page.mouse.click(920, 714); await page.keyboard.type('zz1'); await page.keyboard.press('Tab');
  await page.mouse.click(1097, 714); await page.waitForTimeout(1200);
  await page.screenshot({ path: O + 'w12a.png' });
  // rows: find the picker positions inside the iframe
  const iframeBox = await page.locator('#zd_setup_iframe').boundingBox();
  const pickers = await f.$$eval('*', els => els.filter(e => e.childElementCount === 0 && /--Select field--/.test(e.textContent || '') && e.offsetParent).map(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }));
  return { iframeBox, pickers };
}
