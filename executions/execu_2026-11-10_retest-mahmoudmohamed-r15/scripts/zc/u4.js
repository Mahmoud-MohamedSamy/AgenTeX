module.exports = async ({ page, log, shot }) => {
  await require('./nav.js')(page);
  await page.getByText('QA RT15 GS Colors',{exact:true}).locator('visible=true').first().click(); await page.waitForTimeout(5000);
  await page.mouse.move(750, 288); await page.waitForTimeout(1000); await page.mouse.click(971, 288); await page.waitForTimeout(3000);
  await shot('c-2806-replace-dialog'); log('dlg', (await page.innerText('body')).replace(/\s+/g,' ').slice(-700));
};
