module.exports = async ({ page, log, shot }) => {
  await require('./nav.js')(page);
  await page.getByText('QA RT15 GS Colors',{exact:true}).locator('visible=true').first().click(); await page.waitForTimeout(5000);
  await page.mouse.move(750, 288); await page.waitForTimeout(1500); await shot('c-2806-hover-green');
  await page.mouse.click(948, 200); await page.waitForTimeout(2000); await shot('c-2806-gear');
  log('menu', (await page.innerText('body')).replace(/\s+/g,' ').slice(-500));
};
