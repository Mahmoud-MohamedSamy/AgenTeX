async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await page.mouse.click(920, 687); await page.keyboard.type('zz2'); await page.keyboard.press('Tab'); await page.waitForTimeout(500);
  await page.mouse.click(498, 735); await page.waitForTimeout(1000);
  await page.screenshot({ path: O + 'w15a.png' });
  const inputs = await f.$$eval('input[type=text]', e => e.filter(x => x.offsetParent).map(x => [x.id, x.className.slice(0, 40), x.value].join('|')));
  return { inputs };
}
