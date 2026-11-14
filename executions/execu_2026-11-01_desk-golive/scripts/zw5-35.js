async (page) => {
  await page.reload({waitUntil:'domcontentloaded'}); 
  for (let i=0;i<40;i++){ await page.waitForTimeout(1500); const t=await page.locator('main, [class*=content]').last().innerText().catch(()=>''); if (/Product Name|Departments|Save/i.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-w5/z-p-form.png'});
  return page.url();
}
