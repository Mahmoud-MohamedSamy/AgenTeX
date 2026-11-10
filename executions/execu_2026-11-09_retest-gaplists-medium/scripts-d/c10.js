const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const D='../ndc-2628/evidence/raw/';const o={};
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime|search|query|records\/query|records\/search|list|filter|count|preview/.test(q.request().url()))return q.abort();return q.continue();});
await page.setViewportSize({width:1440,height:950});
const open=async()=>{await page.goto(H+'/modules/'+L,{waitUntil:'load',timeout:120000});await page.getByRole('button',{name:'Module actions'}).waitFor({timeout:90000});await page.waitForTimeout(2500);};
const toastText=async()=>{const t=await page.locator('[role=status],[role=alert],[data-sonner-toast],.toast').allInnerTexts().catch(()=>[]);return t.join(' | ').slice(0,200);};
await open();
for(const it of ['Drafts','Approve Leads','Deduplicate Leads','Create Client Script','Sheet View','Print View']){
 await page.getByRole('button',{name:'Module actions'}).click();await page.waitForTimeout(1000);
 await page.getByRole('menuitem',{name:it}).click().catch(e=>{});await page.waitForTimeout(3500);
 const fn=D+'act-'+it.replace(/\s+/g,'-').toLowerCase()+'.png';await page.screenshot({path:fn});
 const dlg=await page.locator('[role=dialog]').last().innerText().catch(()=>'');
 o[it]={url:page.url().replace(H,'').slice(0,90),toast:await toastText(),dialog:dlg.slice(0,220),soon:/coming soon|in development|not available/i.test(await page.locator('body').innerText())};
 await page.keyboard.press('Escape');await open();}
return o;
