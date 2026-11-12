async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await page.mouse.click(1197, 682); await page.waitForTimeout(3000);
  await page.screenshot({ path: O + 'w21.png' });
  const sels = await f.$$eval('select', s => s.map(x => ({ id: x.id, opts: [...x.options].map(o => o.text) })).filter(x => !/^(moduleTmp|WFTriggerFieldId|WFRatingFieldId)/.test(x.id) && x.opts.length > 3));
  const inputs = await f.$$eval('input[type=text],textarea', e => e.filter(x => x.offsetParent).map(x => [x.id || x.name, x.maxLength, x.placeholder].join('|')));
  return { sels: sels.map(s => ({ id: s.id, n: s.opts.length, all: s.opts.slice(0, 60) })), inputs };
}
