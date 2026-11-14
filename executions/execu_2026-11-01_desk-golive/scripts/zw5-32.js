async (page) => {
  await page.getByText('Products',{exact:true}).last().click(); await page.waitForTimeout(9000);
  await page.screenshot({path:'evidence/zoho-w5/z-p-list.png'});
  const btns = await page.$$eval('button, [role=button]', els => els.filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,40));
  return {url:page.url(), t:(await page.innerText('body')).slice(0,900).replace(/\s+/g,' '), btns};
}
