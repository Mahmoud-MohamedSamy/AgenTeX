const fs=require('fs');const I=JSON.parse(fs.readFileSync('../ndc-2628/ids.json','utf8'));const D='../ndc-2628/evidence/raw/';const o={};
const blocked=[];await page.route('**/api/v1/**',q=>{const m=q.request().method();const u=q.request().url();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime|search|query|list|filter|count|preview/.test(u)){blocked.push(m+' '+u.split('/api/v1')[1].slice(0,90));return q.abort();}return q.continue();});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+I.L+'/records/'+I.R,{waitUntil:'load',timeout:120000});await page.getByText('platypusnote').first().waitFor({timeout:90000});await page.waitForTimeout(1500);
// scroll whole page to find meeting buttons
for(let i=0;i<8;i++){await page.mouse.wheel(0,900);await page.waitForTimeout(300);}
o.btns=[...new Set(await page.locator('button:visible,a:visible').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText.trim()).slice(0,40)).filter(t=>/meeting|activit|schedule|\+ ?task|\+ ?call/i.test(t))))];
const mb=page.getByRole('button',{name:/meeting/i}).first();
if(await mb.count()){await mb.scrollIntoViewIfNeeded();await mb.click();await page.waitForTimeout(2000);
 const mi=page.getByRole('menuitem',{name:/meeting/i});if(await mi.count()){await mi.first().click();}
 await page.waitForTimeout(5000);}
await page.screenshot({path:D+'meeting-quick-create.png'});
const dlg=await page.locator('[role=dialog]').last().innerText().catch(()=>'');o.dialog=dlg.slice(0,1000);o.repeat=/repeat|recurr/i.test(dlg);
o.blocked=blocked;return o;
