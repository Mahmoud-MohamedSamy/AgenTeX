async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const R = {}; let dlg = null;
  const onD = async d => { dlg = d.message(); await d.accept().catch(() => {}); };
  page.on('dialog', onD);
  await page.mouse.click(920, 687); await page.keyboard.press('Control+A'); await page.keyboard.type('zz2'); await page.keyboard.press('Tab'); await page.waitForTimeout(400);
  const pats = ['1', '1 and', '(1 and 2', '1 and 3', '1 or 2'];
  for (let i = 0; i < pats.length; i++) {
    const p = pats[i]; dlg = null;
    const ok = f.getByText('OK', { exact: true });
    if (!(await ok.count()) || !(await ok.last().isVisible())) { await page.mouse.click(498, 735); await page.waitForTimeout(900); }
    await page.mouse.click(620, 734); await page.keyboard.press('Control+A'); await page.keyboard.type(p); await page.waitForTimeout(300);
    await page.mouse.click(439, 763); await page.waitForTimeout(1500);
    await page.screenshot({ path: O + 'w17-' + i + '.png', clip: { x: 220, y: 600, width: 1100, height: 220 } });
    const msgs = await f.$$eval('*', els => els.filter(e => e.childElementCount === 0 && e.offsetParent && (e.textContent || '').trim().length > 3 && (e.textContent || '').length < 200 && /invalid|valid|pattern|error|missing|bracket|parenthes|criteria/i.test(e.textContent)).map(e => e.textContent.trim()));
    const patternShown = (await f.locator('body').innerText()).match(/Criteria Pattern :\s*([^\n]*)/);
    R[p] = { dialog: dlg, shown: patternShown && patternShown[1], msgs: [...new Set(msgs)].filter(m => !/Specify the criteria|^Criteria$/.test(m)).slice(0, 5) };
  }
  page.off('dialog', onD);
  return R;
}
