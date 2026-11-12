async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await f.locator('#showWFRuleStep2Btn').click(); await page.waitForTimeout(3500);
  await page.screenshot({ path: O + 'c13.png' });
  const els = await f.$$eval('input,select,label,span,a', e => e.filter(x => x.offsetParent && x.getBoundingClientRect().y > 90).map(x => { const r = x.getBoundingClientRect(); return [x.tagName, x.id || x.name || '', x.type || '', (x.value && x.tagName !== 'SPAN' ? x.value : x.textContent || '').trim().slice(0, 30), x.checked ? 'CHK' : '', Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2 + 48)].join('|'); }).filter(s => !/\|\|\|\|/.test(s)));
  return els.slice(0, 70);
}
