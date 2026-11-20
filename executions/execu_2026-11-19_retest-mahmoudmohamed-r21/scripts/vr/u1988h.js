const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.goto(H+'/settings/modules-and-fields/'+T+'?tab=fields',{waitUntil:'domcontentloaded'}); await sleep(9000);
log('btns', (await page.getByRole('button').allInnerTexts()).map(s=>s.trim()).filter(Boolean).slice(-12));
const nb=page.getByRole('button',{name:/new field|add field|create field/i}).first(); log('nb',await nb.count()); if(await nb.count()){ await nb.click(); await sleep(2500);
 const d=page.locator('[role=dialog]').last(); log('dlg',(await d.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,1200)); await shot('1988-6a-new-field.png');
 const sl=d.getByText('Single Line',{exact:true}).first(); if(await sl.count()){ await sl.click(); await sleep(2000); const d2=page.locator('[role=dialog]').last(); log('dlg2',(await d2.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,1500)); await shot('1988-6b-new-field-single.png'); } }
