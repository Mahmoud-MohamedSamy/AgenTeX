async (page) => {
  const out={};
  for (const [id,val] of [['#ZD_34','20Nov2026'],['#ZD_35','10Nov2026']]) {
    const f = page.locator(id); await f.click({position:{x:5,y:8}}); await page.waitForTimeout(400);
    await page.keyboard.type(val,{delay:120}); await page.waitForTimeout(800);
    out[id]=await f.inputValue();
    await page.keyboard.press('Tab'); await page.waitForTimeout(800);
  }
  await page.locator('text=Contract Information').click(); await page.waitForTimeout(1500);
  out.s=await page.locator('#ZD_34').inputValue(); out.e=await page.locator('#ZD_35').inputValue();
  await page.screenshot({path:'evidence/zoho-w5/z-k-dates.png'});
  out.t=(await page.innerText('body')).match(/Contract Information[\s\S]{0,400}/)[0].replace(/\s+/g,' ');
  return out;
}
