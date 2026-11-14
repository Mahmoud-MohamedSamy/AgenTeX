async (page) => {
  await page.waitForTimeout(6000);
  await page.mouse.click(181,413); await page.waitForTimeout(9000);
  await page.screenshot({path:'evidence/zoho-w5/z-p-form.png'});
  const texts=[]; for (const f of page.frames()) { const t=(await f.innerText('body').catch(()=>'')); if (/Product/i.test(t)) texts.push(f.url().slice(0,80)+' :: '+t.slice(0,700).replace(/\s+/g,' ')); }
  return {url:page.url(), texts};
}
