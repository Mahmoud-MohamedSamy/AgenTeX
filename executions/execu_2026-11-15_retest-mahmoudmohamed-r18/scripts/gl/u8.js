const net=[]; page.on('response',async r=>{ if(r.url().includes('email-templates') && r.request().method()!=='GET'){ net.push(r.request().method()+' '+r.url().split('email-templates')[1]+' '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,160)); }});
await page.goto(H+'/settings/organization/email-templates',{waitUntil:'domcontentloaded'}); await sleep(12000);
const row=page.locator('tr').filter({hasText:'QA RT18 reply ack'}).first();
await row.scrollIntoViewIfNeeded(); const rowTxt=(await row.innerText()).replace(/\s+/g,' ');
await row.locator('button').last().click(); await sleep(1500);
const menu=(await page.locator('[role=menu]').last().innerText()).replace(/\s+/g,' ');
await shot('3003-1-own-menu.png');
await page.keyboard.press('Escape'); await sleep(800);
const sys=page.locator('tr').filter({hasText:'Reply acknowledgement'}).filter({hasNotText:'QA RT18'}).first();
let sysMenu='';
if(await sys.count()){ await sys.locator('button').last().click(); await sleep(1500); sysMenu=(await page.locator('[role=menu]').last().innerText()).replace(/\s+/g,' '); await shot('3003-2-builtin-menu.png'); await page.keyboard.press('Escape'); await sleep(800);}
// deactivate own
await row.locator('button').last().click(); await sleep(1200);
await page.getByRole('menuitem',{name:/^Deactivate/}).click(); await sleep(1500);
const dlg=(await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ');
await shot('3003-3-deactivate-dialog.png');
await page.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/^Deactivate$/}).last().click(); await sleep(4000);
const rowTxt2=(await row.innerText()).replace(/\s+/g,' ');
await row.locator('button').last().click(); await sleep(1200);
const menu2=(await page.locator('[role=menu]').last().innerText()).replace(/\s+/g,' ');
await page.getByRole('menuitem',{name:/^Delete/}).click(); await sleep(1500);
const dlg2=(await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ');
await shot('3003-4-delete-dialog.png');
await page.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/^Delete/}).last().click(); await sleep(4000);
await shot('3003-5-after-delete.png');
const still=await page.locator('tr').filter({hasText:'QA RT18 reply ack'}).count();
return {rowTxt,menu,sysMenu,dlg,rowTxt2,menu2,dlg2,still,net};
