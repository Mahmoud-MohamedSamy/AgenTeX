async (page) => {
  await page.mouse.click(325,610); await page.waitForTimeout(1000);
  await page.locator('text=Contract Information').click(); await page.waitForTimeout(1500);
  await page.screenshot({path:'evidence/zoho-w5/z-k-dates.png'});
  return {s: await page.locator('#ZD_34').inputValue(), e: await page.locator('#ZD_35').inputValue(), t:(await page.innerText('body')).match(/Contract Information[\s\S]{0,400}/)[0].replace(/\s+/g,' ')};
}
