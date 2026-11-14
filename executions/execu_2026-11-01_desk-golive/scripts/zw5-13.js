async (page) => {
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/contracts/list/all',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  const nn = page.locator('text=/^Not Now$/'); if (await nn.count()) await nn.first().click().catch(()=>{});
  await page.screenshot({path:'evidence/zoho-w5/z-k-list.png'});
  return {url:page.url(), t:(await page.innerText('body')).slice(0,800).replace(/\s+/g,' ')};
}
