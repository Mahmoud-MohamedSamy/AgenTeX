async (page) => {
  await page.waitForTimeout(5000);
  await page.screenshot({path:'evidence/zoho-w5/z-k-list.png'});
  const btns = await page.$$eval('button, [role=button], a', els => els.filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||e.getAttribute('data-title')||'').trim()).filter(Boolean).slice(0,50));
  return {t:(await page.innerText('body')).slice(0,800).replace(/\s+/g,' '), btns};
}
