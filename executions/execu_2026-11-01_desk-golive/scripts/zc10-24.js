async (page) => {
  await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/users-control/datasharing',{waitUntil:'commit',timeout:60000}).catch(()=>{});
  for (let i=0;i<30;i++){ await page.waitForTimeout(1500); const t=await page.innerText('body').catch(()=>''); if (/MODULE\s+ACCESS LEVEL/i.test(t) && /Edit/.test(t)) break; }
  await page.getByText('Edit',{exact:true}).first().click(); await page.waitForTimeout(3000);
  await page.locator('[class*=accessdropd]').first().click(); await page.waitForTimeout(1500);
  await page.locator('div.zd_v2-typography-dotted:visible').filter({hasText:/^Public Read\/Write\/Delete$/}).first().click(); await page.waitForTimeout(1500);
  const first = (await page.locator('[class*=accessdropd]').first().innerText()).trim();
  if (first==='Public Read/Write/Delete') { await page.getByRole('button',{name:'Update'}).click(); }
  let t=''; for (let i=0;i<10;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body')).replace(/\s+/g,' '); if (!/UpdateCancel/.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-c10/data-sharing-restored.png'});
  return {first, t:t.slice(t.indexOf('MODULE'),t.indexOf('MODULE')+330)};
}
