await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.getByText('Round Robin',{exact:true}).first().waitFor({timeout:120000});
await page.getByText('Round Robin',{exact:true}).first().click();await sleep(4000);
await page.getByText('Customer Support',{exact:true}).last().click();await sleep(1500);
await page.getByText('QA AO Dept B',{exact:true}).last().click();await sleep(4000);
await page.getByRole('button',{name:'More Round Robin actions'}).click();await sleep(1500);
await page.getByRole('menuitem',{name:/Preferences/}).first().click().catch(async e=>{log('nomi');await page.getByText(/^Preferences$/).last().click()});await sleep(5000);
await shot('3137-d-preferences.png');
const dlg=page.locator('[role=dialog]').last(); if(await dlg.count()){await dlg.screenshot({path:require('path').join(__dirname,'..','..','screenshots','raw','3137-d-pref-dialog.png')}).catch(e=>log('nodlgshot '+e.message.slice(0,80)));log((await dlg.innerText()).replace(/\s+/g,' ').slice(0,1500));}
