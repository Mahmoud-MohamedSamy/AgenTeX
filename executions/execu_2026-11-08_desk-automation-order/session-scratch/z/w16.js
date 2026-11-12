async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const R = {}; let dlg = null;
  const onD = async d => { dlg = d.message(); await d.accept().catch(() => {}); };
  page.on('dialog', onD);
  const pats = ['1', '1 and', '(1 and 2', '1 and 3', '1 or 2'];
  for (let i = 0; i < pats.length; i++) {
    const p = pats[i]; dlg = null;
    const box = f.locator('input[type=text]:visible').last();
    const v = await box.inputValue().catch(() => '');
    if (!/and|or|^\(|^[0-9]/i.test(v)) { await page.mouse.click(498, 735); await page.waitForTimeout(800); }
    const pin = f.locator('input[type=text]:visible').last();
    await pin.fill(p); await page.waitForTimeout(300);
    await f.getByText('OK', { exact: true }).last().click({ force: true }).catch(() => page.mouse.click(439, 763));
    await page.waitForTimeout(1500);
    const txt = (await f.locator('body').innerText()).replace(/\n{2,}/g, '\n');
    const near = txt.split('Criteria Pattern').slice(1).join(' | ').slice(0, 220);
    const errs = await f.$$eval('*', els => els.filter(e => e.childElementCount === 0 && e.offsetParent && /invalid|pattern|criteria|error|not valid|missing|bracket|parenthes/i.test(e.textContent || '') && (e.textContent || '').length < 200).map(e => e.textContent.trim()));
    R[p] = { dialog: dlg, near, errs: [...new Set(errs)].slice(0, 6) };
    await page.screenshot({ path: O + 'w16-' + i + '.png' });
  }
  page.off('dialog', onD);
  return R;
}
