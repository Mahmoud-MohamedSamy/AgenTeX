async (page) => {
  await page.getByRole('button',{name:'Cancel'}).click().catch(()=>{}); await page.waitForTimeout(1500);
  const lv = page.locator('text=/Leave|Discard|Yes/').first(); if (await lv.count()) { /* do not click unknown */ }
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup/products',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
  await page.screenshot({path:'evidence/zoho-w5/z-p-list.png'});
  return {url:page.url(), t:(await page.innerText('body')).slice(0,900).replace(/\s+/g,' ')};
}
