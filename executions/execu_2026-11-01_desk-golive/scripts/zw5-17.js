async (page) => {
  const s = page.locator('#ZD_34'); await s.click(); await page.waitForTimeout(1200);
  await page.screenshot({path:'evidence/zoho-w5/z-k-startpicker.png'});
  // pick day 20 in the open calendar
  const d20 = page.locator('[class*=alendar] >> text=/^20$/').first();
  await d20.click().catch(e=>{}); await page.waitForTimeout(800);
  const sv = await s.inputValue();
  const e = page.locator('#ZD_35'); await e.click(); await page.waitForTimeout(1200);
  await page.screenshot({path:'evidence/zoho-w5/z-k-endpicker.png'});
  const days = await page.$$eval('[class*=alendar] [class*=ay], [class*=alendar] td, [class*=alendar] span', els => els.filter(x=>x.offsetParent && /^\d{1,2}$/.test((x.innerText||'').trim())).map(x=>(x.innerText.trim())+':'+(x.className||'').toString().replace(/\s+/g,'.').slice(0,80)+':'+(x.getAttribute('aria-disabled')||'')).slice(0,40));
  return {sv, days};
}
