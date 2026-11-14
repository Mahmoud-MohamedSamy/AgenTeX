async (page) => {
  // Contract Name and Account Name are left EMPTY, so Zoho cannot save; this only shows its form validation messages.
  await page.getByRole('button',{name:'Submit'}).click(); await page.waitForTimeout(2500);
  await page.screenshot({path:'evidence/zoho-w5/z-k-submit-empty.png'});
  return {url:page.url(), t:(await page.innerText('body')).match(/Contract Information[\s\S]{0,700}/)[0].replace(/\s+/g,' ')};
}
