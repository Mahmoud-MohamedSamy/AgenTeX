async (page) => {
  const nn = page.locator('text=/^Not Now$/'); if (await nn.count()) await nn.first().click().catch(()=>{});
  await page.locator('button[data-id="zdsetup"]').first().click({force:true}).catch(async()=>{await page.keyboard.press("s")});
  for (let i=0;i<40;i++){ await page.waitForTimeout(1500); const t=await page.innerText('body').catch(()=>''); if (/Profiles|Users and Control|Automation|Data Administration/i.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-w3/z-setup.png'});
  return {url: page.url(), t:(await page.innerText('body')).replace(/\s+/g,' ').slice(0,3000)};
}
