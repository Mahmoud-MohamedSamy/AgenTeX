async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const log = [];
  for (let i = 0; i < 3; i++) {
    const sel = f.locator('.select2-container:visible').filter({ hasText: '--Select field--' }).first();
    if (!(await sel.count())) { log.push('no field picker for row ' + (i + 1)); break; }
    await sel.click(); await page.waitForTimeout(600);
    await page.keyboard.type('Subject'); await page.waitForTimeout(800); await page.keyboard.press('Enter'); await page.waitForTimeout(800);
    const vals = f.locator('input[type=text]:visible');
    const n = await vals.count(); if (n) { await vals.nth(n - 1).fill('zz' + (i + 1)); }
    if (i < 2) { const plus = f.locator('[class*=add]:visible, .addCriteria:visible, span:has-text("+"):visible').last(); log.push('plus ' + await plus.count()); await plus.click().catch(e => log.push('plus err')); await page.waitForTimeout(800); }
  }
  await page.screenshot({ path: O + 'w10.png' });
  const t = (await f.locator('body').innerText()).replace(/\n{2,}/g, '\n');
  return { log, crit: t.split('Criteria (Specify the criteria to execute this rule)').slice(-1)[0].slice(0, 900) };
}
