async (page) => {
  const nn = page.locator('text=/^Not Now$/'); if (await nn.count()) await nn.first().click().catch(()=>{});
  await page.locator('button[data-id="zdsetup"]').first().click({force:true}).catch(()=>{});
  let t=''; for (let i=0;i<30;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' '); if (/Data Sharing|Users and Control|Profiles/i.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-c10/setup.png'});
  return {url:page.url(), t:t.slice(0,1500)};
}
