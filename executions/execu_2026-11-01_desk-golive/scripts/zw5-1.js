async (page) => {
  for (let i=0;i<30;i++){ try{ await page.waitForTimeout(1000); if ((await page.innerText('body')).length>500) break;}catch(e){} }
  const nn = page.locator('text=/^Not Now$/'); if (await nn.count()) await nn.first().click().catch(()=>{});
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
  await page.screenshot({path:'evidence/zoho-w5/z-tickets.png'});
  return (await page.innerText('body')).slice(0,1500).replace(/\s+/g,' ');
}
