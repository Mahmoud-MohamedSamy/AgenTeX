const res=[]; page.on('response',async r=>{ if(r.url().includes('/channels/domains') && r.request().method()!=='GET'){ res.push(r.request().method()+' '+r.url().split('/api/v1')[1]+' '+r.status()+' → '+(await r.text().catch(()=>'')).slice(0,200)); }});
await page.goto(H+'/settings/channels/email',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.getByRole('tab',{name:/Your domains/}).click(); await sleep(3000);
await page.mouse.wheel(0,460); await sleep(1000);
await page.mouse.click(1386,487); await sleep(1500);
const items=await page.locator('[role=menuitem],[role=menu] button').allInnerTexts();
await shot('3002-6-xcom-menu.png');
const rm=page.getByRole('menuitem',{name:/Remove|Delete/i}).first();
if(await rm.count()){ await rm.click(); await sleep(1500); await shot('3002-7-remove-dialog.png'); const dlg=(await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ');
  const b=page.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/Remove|Delete/}).last(); if(await b.count()) { await b.click(); await sleep(5000);} 
  await page.reload({waitUntil:'domcontentloaded'}); await sleep(9000); await page.getByRole('tab',{name:/Your domains/}).click(); await sleep(3000); await shot('3002-8-after-remove.png');
  return {items,dlg,res,listed:(await page.locator('main').innerText()).includes('x.com\n')};
}
return {items,res};
