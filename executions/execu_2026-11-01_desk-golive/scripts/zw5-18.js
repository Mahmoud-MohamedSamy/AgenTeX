async (page) => {
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  const s = page.locator('#ZD_34'); await s.click(); await page.keyboard.press('Home'); await page.keyboard.type('20112026',{delay:80}); await page.waitForTimeout(600);
  await page.keyboard.press('Escape'); await page.locator('text=Contract Information').click(); await page.waitForTimeout(600);
  const e = page.locator('#ZD_35'); await e.click(); await page.keyboard.press('Home'); await page.keyboard.type('10112026',{delay:80}); await page.waitForTimeout(600);
  await page.keyboard.press('Escape'); await page.locator('text=Contract Information').click(); await page.waitForTimeout(1500);
  await page.screenshot({path:'evidence/zoho-w5/z-k-dates.png'});
  return {s: await s.inputValue(), e: await e.inputValue(), t:(await page.innerText('body')).match(/Contract Information[\s\S]{0,500}/)[0].replace(/\s+/g,' ')};
}
