module.exports = async ({ page, log, shot }) => {
  await require('./view.js')(page, 'QA RT15 2807 view');
  await page.mouse.click(550,171); await page.waitForTimeout(2500);
  await page.getByText('Select All records in this view').locator('visible=true').first().click(); await page.waitForTimeout(2500);
  await shot('c-2807-selected-all');
  await page.getByRole('button',{name:'Mass Update'}).locator('visible=true').first().click(); await page.waitForTimeout(4000);
  await shot('c-2807-mu-dialog'); const t = (await page.innerText('body')) || ''; log(t.replace(/\s+/g,' ').slice(-600));
};
