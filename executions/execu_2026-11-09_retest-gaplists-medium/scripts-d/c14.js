const fs=require('fs');const I=JSON.parse(fs.readFileSync('../ndc-2628/ids.json','utf8'));const D='../ndc-2628/evidence/raw/';const o={};
const blocked=[];await page.route('**/api/v1/**',q=>{const m=q.request().method();const u=q.request().url();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime|search|query|list|filter|count|preview/.test(u)){blocked.push(m+' '+u.split('/api/v1')[1].slice(0,90));return q.abort();}return q.continue();});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+I.L+'/records/'+I.R,{waitUntil:'load',timeout:120000});await page.getByText('platypusnote').first().waitFor({timeout:90000});await page.waitForTimeout(1500);
await page.getByRole('button',{name:/^New$/}).first().click();await page.waitForTimeout(1500);
o.newMenu=(await page.locator('[role=menu],[role=menuitem],[role=dialog]').allInnerTexts().catch(()=>[])).join('\n').split('\n').filter(Boolean).slice(0,30);
await page.screenshot({path:D+'new-menu.png'});
const m=page.getByText(/^Meeting$/).first();if(await m.count()){await m.click();await page.waitForTimeout(5000);}
await page.screenshot({path:D+'meeting-quick-create.png'});
const dlg=await page.locator('[role=dialog]').last().innerText().catch(()=>'');o.dialog=dlg.slice(0,900);o.repeat=/repeat|recurr/i.test(dlg);o.url=page.url().replace(H,'').slice(0,100);
o.blocked=blocked;return o;
