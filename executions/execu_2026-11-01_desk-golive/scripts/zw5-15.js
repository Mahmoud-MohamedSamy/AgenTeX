async (page) => {
  await page.getByRole('button',{name:'Add new Contract'}).first().click().catch(async()=>{ await page.locator('[aria-label="Add new Contract"]').first().click(); });
  await page.waitForTimeout(6000);
  await page.screenshot({path:'evidence/zoho-w5/z-k-form.png'});
  return {url:page.url(), t:(await page.innerText('body')).slice(0,1500).replace(/\s+/g,' ')};
}
