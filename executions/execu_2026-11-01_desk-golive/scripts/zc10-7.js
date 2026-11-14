async (page) => {
  await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/users-control/datasharing',{waitUntil:'domcontentloaded'});
  for (let i=0;i<30;i++){ await page.waitForTimeout(1500); const t=await page.innerText('body').catch(()=>''); if (/MODULE\s+ACCESS LEVEL/i.test(t)) break; }
  await page.getByText('Edit',{exact:true}).first().click(); await page.waitForTimeout(3000);
  await page.screenshot({path:'evidence/zoho-c10/data-sharing-edit.png'});
  const ctrls = await page.locator('select:visible,[role=combobox]:visible,[class*=select]:visible,[class*=dropdown]:visible,button:visible').evaluateAll(es=>es.map(e=>[e.tagName,e.className.toString().slice(0,50),(e.innerText||'').trim().slice(0,40)].join('|')).slice(-40));
  const t=(await page.innerText('body')).replace(/\s+/g,' '); return {ctrls, t:t.slice(t.indexOf('Data Sharing'),t.indexOf('Data Sharing')+1500)};
}
