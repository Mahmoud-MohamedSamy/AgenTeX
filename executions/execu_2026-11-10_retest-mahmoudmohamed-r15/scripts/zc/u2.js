module.exports = async ({ page, log, shot }) => {
  await require('./nav.js')(page);
  await page.getByText('Leads',{exact:true}).locator('visible=true').last().click(); await page.waitForTimeout(4000);
  await shot('c-2806-usedin'); log('usedin', (await page.innerText('body')).replace(/\s+/g,' ').slice(-600));
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  await page.getByText('QA RT15 GS Colors',{exact:true}).locator('visible=true').first().click(); await page.waitForTimeout(6000);
  await shot('c-2806-edit'); log('edit', (await page.innerText('body')).replace(/\s+/g,' ').slice(-900));
};
