async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(1496, 73); await page.waitForTimeout(7000);
  await page.screenshot({ path: O + 'w5.png' });
  return { url: page.url(), inputs: await page.$$eval('input:not([type=hidden]),textarea', e => e.filter(x => x.offsetParent).map(x => [x.name || x.id, x.placeholder, x.maxLength].join('|'))) };
}
