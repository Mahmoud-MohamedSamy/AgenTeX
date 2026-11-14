async (page) => {
  await page.mouse.click(812,557); await page.waitForTimeout(1000);   // 20 Nov
  const s = await page.locator('#ZD_34').inputValue();
  await page.locator('text=Contract Information').click(); await page.waitForTimeout(400);
  await page.mouse.click(476,470); await page.waitForTimeout(1500);
  await page.screenshot({path:'evidence/zoho-w5/z-k-endcal.png'});
  return {s};
}
