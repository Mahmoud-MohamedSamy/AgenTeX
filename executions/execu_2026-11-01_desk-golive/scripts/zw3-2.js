async (page) => {
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup/landing',{waitUntil:'domcontentloaded'});
  for (let i=0;i<40;i++){ await page.waitForTimeout(1500); const t=await page.innerText('body').catch(()=>''); if (/Profiles|Users and Control|Automation/i.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-w3/z-setup.png'});
  return page.url() + ' :: ' + (await page.innerText('body')).replace(/\s+/g,' ').slice(0,3000);
}
