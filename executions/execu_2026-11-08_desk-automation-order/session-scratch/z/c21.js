async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(1197, 682); await page.waitForTimeout(3000);
  await page.screenshot({ path: O + 'c21.png' });
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const els = await f.$$eval('input,select,textarea', e => e.filter(x => x.offsetParent && x.getBoundingClientRect().y > 0).map(x => { const r = x.getBoundingClientRect(); return [x.tagName, x.id || x.name || '', x.type || '', (x.placeholder || x.value || '').slice(0, 30), Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2 + 48)].join('|'); }));
  return els.filter(s => !/setupSearch|Search articles/.test(s));
}
