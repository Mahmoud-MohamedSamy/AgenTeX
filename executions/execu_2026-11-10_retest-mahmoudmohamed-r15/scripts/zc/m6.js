module.exports = async ({ page, log, shot }) => {
  await require('./view.js')(page, 'QA RT15 2807 view');
  await page.mouse.click(550,171); await page.waitForTimeout(2500);
  await page.getByText('Select All records in this view').locator('visible=true').first().click(); await page.waitForTimeout(2500);
  await page.getByRole('button',{name:'Mass Update'}).locator('visible=true').first().click(); await page.waitForTimeout(4000);
  await page.getByText('Select a field').locator('visible=true').first().click(); await page.waitForTimeout(2500);
  await shot('c-2807-mu-fieldlist');
  const inputs = await page.$$eval('input', is => is.filter(i=>i.offsetParent).map(i=>[i.placeholder, Math.round(i.getBoundingClientRect().x), Math.round(i.getBoundingClientRect().y)]));
  log('inputs', inputs);
  const ls = page.getByText('Lead Source', { exact: true }).locator('visible=true'); log('ls count', await ls.count());
};
