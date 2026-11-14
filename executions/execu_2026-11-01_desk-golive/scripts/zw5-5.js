async (page) => {
  const t = (await page.innerText('body')).match(/UPDATE FIELD[\s\S]{0,300}/)?.[0];
  await page.mouse.click(390,180); await page.waitForTimeout(1500);
  await page.screenshot({path:'evidence/zoho-w5/z-e1-fields.png'});
  const t2 = (await page.innerText('body')).match(/UPDATE FIELD[\s\S]{0,900}/)?.[0];
  return [t,t2].map(x=>(x||'').replace(/\s+/g,' '));
}
