const out={};await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/settings',{waitUntil:'load',timeout:120000});await page.waitForTimeout(8000);
for(const q of ['attachment','translat','anonym','gamescope','chat','whatsapp','cliq','remote','extension','marketplace','offline','idle','related ticket','attendance']){
 try{await page.keyboard.press('Control+k');await page.waitForTimeout(1500);await page.keyboard.type(q);await page.waitForTimeout(3500);
 const dlg=page.locator('[role=dialog]').first();out[q]=(await dlg.innerText()).replace(/\n+/g,' | ').slice(0,500);
 if(['attachment','translat','anonym','offline'].includes(q)) await page.screenshot({path:'evidence/raw/search-'+q.replace(' ','_')+'.png'});
 await page.keyboard.press('Escape');await page.waitForTimeout(800);}catch(e){out[q]='ERR '+String(e.message).slice(0,80);await page.keyboard.press('Escape')}}
return out;
