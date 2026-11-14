async (page) => {
  const row = page.locator('[data-id^=listViewCheckBox_]').first();
  await row.hover().catch(()=>{}); await row.click({force:true}); await page.waitForTimeout(1500);
  await page.screenshot({path:'evidence/zoho-w5/z-e1-selected.png'});
  const btns = await page.$$eval('button, [role=button]', els => els.filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||e.getAttribute('data-title')||'').trim()).filter(Boolean).slice(0,60));
  return btns;
}
