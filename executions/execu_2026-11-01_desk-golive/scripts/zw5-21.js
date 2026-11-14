async (page) => {
  await page.keyboard.press('Escape'); await page.locator('text=Contract Information').click(); await page.waitForTimeout(500);
  await page.mouse.click(866,384); await page.waitForTimeout(1500);
  await page.screenshot({path:'evidence/zoho-w5/z-k-cal.png'});
  return 1;
}
