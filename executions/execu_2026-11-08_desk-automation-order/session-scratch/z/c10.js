async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(1496, 73); await page.waitForTimeout(4000);
  await page.screenshot({ path: O + 'c10.png' });
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const els = await f.$$eval('input,select,textarea,button', e => e.filter(x => x.offsetParent).map(x => { const r = x.getBoundingClientRect(); return [x.tagName, x.id || x.name, x.type, (x.placeholder || x.value || x.textContent || '').slice(0, 30), Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)].join('|'); }));
  return els.slice(0, 40);
}
