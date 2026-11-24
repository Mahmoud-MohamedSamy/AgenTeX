await go('/');
await page.waitForTimeout(4000);
const L = page.locator('[data-testid="tia-launcher"]');
log('launcher count', await L.count(), 'url', page.url());
await shot('H01-desk-home-rst');
if (await L.count()) {
  log('launcher aria', await L.first().getAttribute('aria-label'));
  await L.first().click(); await page.waitForTimeout(2500);
  await shot('H06-panel-open-rst');
  const panel = page.locator('[data-testid="tia-panel"]');
  log('panel', await panel.count());
  log('panel text', (await panel.innerText().catch(() => '')).slice(0, 1200));
  const ids = await page.$$eval('[data-testid^="tia"]', els => [...new Set(els.map(e => e.getAttribute('data-testid')))]);
  log('testids', ids.join(' '));
  const inp = page.locator('[data-testid="tia-panel"] textarea, [data-testid="tia-panel"] input[type=text]');
  log('input', await inp.count(), await inp.first().getAttribute('aria-label').catch(() => null), await inp.first().getAttribute('placeholder').catch(() => null), await inp.first().getAttribute('maxlength').catch(() => null));
  log('focused', await page.evaluate(() => document.activeElement?.tagName + ' ' + (document.activeElement?.getAttribute('aria-label') || '')));
}
return 'done';
