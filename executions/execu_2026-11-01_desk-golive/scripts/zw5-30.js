async (page) => {
  await page.locator('[aria-label="Quick Action Dropdown"]').first().click(); await page.waitForTimeout(1500);
  const t=(await page.innerText('body')).slice(0,500).replace(/\s+/g,' ');
  await page.screenshot({path:'evidence/zoho-w5/z-quick.png'});
  await page.keyboard.press('Escape');
  return t;
}
