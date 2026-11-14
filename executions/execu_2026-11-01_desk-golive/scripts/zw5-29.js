async (page) => {
  await page.getByText('Customers',{exact:true}).first().click(); await page.waitForTimeout(8000);
  const url1=page.url();
  const t=(await page.innerText('body')).slice(0,700).replace(/\s+/g,' ');
  await page.screenshot({path:'evidence/zoho-w5/z-cust.png'});
  return {url1,t};
}
