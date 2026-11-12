const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h; await openEditor(h, 'QA AO WF dbg');
  const main = page.locator('main').last();
  const b = main.getByRole('button', { name: 'Field Changed', exact: true }).first();
  log('bbBefore', await b.boundingBox());
  await main.getByText(/This rule will be executed/).first().click(); await page.waitForTimeout(1000);
  log('bbAfter', await b.boundingBox()); await shot('s7dbg');
  await b.dispatchEvent('click'); await page.waitForTimeout(600);
  log('summaryAfterDispatch', (await main.innerText()).split('\n').find(l => /This rule will be executed/.test(l)));
};
