async (page, frame) => {
  await page.waitForTimeout(3000);
  const f = frame();
  const t = (await f.innerText('body').catch(e=>'ERR '+e.message)).slice(0,1200).replace(/\s+/g,' ');
  const btns = await f.$$eval('button, [role=button], a, input[type=button]', els => els.filter(e=>e.offsetParent).map(e=>(e.innerText||e.value||e.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,40)).catch(()=>[]);
  await page.screenshot({path:'evidence/zoho-w5/z-p-list.png'});
  return {furl:f.url().slice(0,120), t, btns};
}
