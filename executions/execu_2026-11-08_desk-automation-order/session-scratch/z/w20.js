async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await page.mouse.click(1072, 682); await page.waitForTimeout(2500);
  await page.screenshot({ path: O + 'w20a.png' });
  const t = (await f.locator('body').innerText()).replace(/\n{2,}/g, '\n');
  const sels = await f.$$eval('select', s => s.filter(x => x.offsetParent || x.closest('.select2-container') || true).map(x => ({ id: x.id, name: x.name, opts: [...x.options].map(o => o.text).slice(0, 80) })).filter(x => x.opts.length > 3));
  return { tail: t.slice(-1200), sels: sels.map(s => ({ id: s.id, name: s.name, n: s.opts.length, hasCreatedBy: s.opts.some(o => /created by/i.test(o)), sys: s.opts.filter(o => /created|modified|request id|ticket id|closed time|ticket number/i.test(o)) })) };
}
