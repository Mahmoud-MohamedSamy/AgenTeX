// Look at import history for the QA RT 2302 imports.
module.exports = async ({ page, shot, log, gotoReady, args }) => {
  await gotoReady(args[0] || 'https://crm.zoho.com/crm/org943261092/settings/data-import/history', /History|history|Import/);
  await page.waitForTimeout(5000);
  log(page.url());
  await shot('imp-history');
  log((await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 3000));
  log(await page.locator('a:visible, link-to:visible').evaluateAll(es => es.filter(e => /histor/i.test(e.innerText + (e.getAttribute('href') || '') + (e.getAttribute('lt-prop-route') || ''))).map(e => e.innerText.trim() + ' -> ' + (e.getAttribute('href') || e.getAttribute('lt-prop-route')))));
};
