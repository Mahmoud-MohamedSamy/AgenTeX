async (page) => {
  await page.mouse.click(349,668); await page.waitForTimeout(1200);
  await page.screenshot({path:'evidence/zoho-w5/z-k-endcal2.png'});
  return 1;
}
