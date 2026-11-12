module.exports = async (h) => {
  const { page, shot, log, go } = h;
  await go('/settings/developer/custom-actions'); await page.waitForTimeout(2500);
  const main = page.locator('main').last();
  await main.getByText('API sources', { exact: true }).first().click(); await page.waitForTimeout(1500);
  log('btns', (await main.getByRole('button').allInnerTexts()).filter(t => t && !/Run/.test(t)).slice(-12));
  const add = main.getByRole('button', { name: /add|new|connect|import/i }).last(); log('addBtn', await add.innerText().catch(() => ''));
  await add.click(); await page.waitForTimeout(1500);
  const dlg = page.getByRole('dialog').first();
  log('dialog', (await dlg.innerText().catch(async () => (await main.innerText()).slice(-800))).slice(0, 1200));
  log('fields', await page.locator('input, textarea, select').evaluateAll(a => a.filter(x => x.offsetParent).map(x => x.tagName + '|' + (x.placeholder || '') + '|' + (x.getAttribute('aria-label') || '') + '|' + (x.name || ''))));
  await shot('rx-p22-source');
};
