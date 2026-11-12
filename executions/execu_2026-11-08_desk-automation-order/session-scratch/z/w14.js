async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await f.evaluate(() => { [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).forEach(e => e.scrollTop = e.scrollHeight); });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: O + 'w14.png' });
  const rows = await f.$$eval('*', els => els.filter(e => e.childElementCount === 0 && /--Select field--|^Subject$|^AND$|^OR$|Pattern/i.test((e.textContent || '').trim()) && e.offsetParent).map(e => { const r = e.getBoundingClientRect(); return [e.textContent.trim().slice(0, 30), Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2 + 48)]; }));
  return rows;
}
