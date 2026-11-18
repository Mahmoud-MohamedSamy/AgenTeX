const net=[]; page.on('response',async r=>{ if(r.url().includes('/api/v1/workflow/custom-actions') && r.request().method()!=='GET'){ net.push(r.request().method()+' '+r.url().split('/api/v1')[1]+' '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300)); }});
await page.goto(H+'/settings',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.getByRole('button',{name:'Custom Actions',exact:true}).first().click().catch(async()=>page.getByText('Custom Actions',{exact:true}).first().click()); await sleep(10000);
const url=page.url();
const row=page.locator('main tr, main [role=row], main li, main article').filter({hasText:'QA RT18 CA echo'}).last();
const n=await row.count(); let menu='',dlg='',after='',toast='';
if(n){ await row.scrollIntoViewIfNeeded(); await shot('3042-1-list.png');
  const btns=await row.locator('button').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')||e.innerText));
  await row.locator('button').last().click(); await sleep(1500);
  menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).replace(/\s+/g,' ');
  await page.getByRole('menuitem',{name:/Delete/}).click(); await sleep(2500);
  dlg=(await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ');
  await shot('3042-2-delete-dialog.png');
  const conf=page.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/^Delete/}).last();
  const confDis=await conf.isDisabled().catch(()=>null);
  if(await conf.count() && !confDis){ await conf.click(); await sleep(4000); }
  toast=(await page.locator('[data-sonner-toast],[role=status]').allInnerTexts().catch(()=>[])).join(' | ');
  after=(await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ');
  await shot('3042-3-after-confirm.png');
  return {url,btns,menu,dlg,confDis,toast,after,net};
}
return {url,n,t:(await page.locator('main').last().innerText()).slice(0,1500)};
