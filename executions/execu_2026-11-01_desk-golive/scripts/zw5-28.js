async (page) => {
  await page.waitForTimeout(6000);
  const btns = await page.$$eval('button, [role=button]', els => els.filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,30));
  await page.screenshot({path:'evidence/zoho-w5/z-p-list.png'});
  return {t:(await page.innerText('body')).slice(0,600).replace(/\s+/g,' '), btns};
}
