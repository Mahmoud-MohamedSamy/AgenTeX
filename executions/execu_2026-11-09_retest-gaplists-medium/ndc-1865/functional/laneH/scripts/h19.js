page.on('request',r=>{if(/\/replies$/.test(r.url())&&r.method()==='POST')out.replyBody=(r.postData()||'').replace(/"body_html":"[^"]{0,200}[^"]*"/,m=>m.slice(0,260)).slice(0,700);});
out.loaded=await openTicket();await page.waitForTimeout(2000);
let step='reply';try{
await page.locator('button:has-text("Reply All")').first().click();await wt(/Insert template/);await page.waitForTimeout(3000);
const ed=page.locator('[contenteditable=true]').first();out.draftHasTemplate=/QA FT 1865 H template: ticket 2484/.test(await ed.innerText());
if(!out.draftHasTemplate){step='insert';await page.locator('button:has-text("Insert template")').first().click();await page.waitForTimeout(3000);await page.locator('text=QA FT 1865 H template').first().click({timeout:15000});await page.waitForTimeout(1500);await page.locator('[role=dialog] button').filter({hasText:/^Insert/}).first().click();await page.waitForTimeout(3000);}
step='recip';const ri=page.locator('input[placeholder="Add a recipient"]').first();
let t=await body();let seg=t.slice(t.indexOf('Recipients'),t.indexOf('Subject'));
if(!/^Recipients\s*\n\s*mmohamed/.test(seg)&&await ri.count()){await ri.click();await ri.type('mmohamed@anyware.software');await page.keyboard.press('Enter');await page.waitForTimeout(1000);}
const ccx=page.locator('button[aria-label*="Remove mmohamed" i]');if(await ccx.count()>1){await ccx.nth(1).click();await page.waitForTimeout(800);}
t=await body();out.recips=t.slice(t.indexOf('Recipients'),t.indexOf('Subject')).replace(/\n/g,' | ');
out.subjectVal=await page.locator('input[value*="QA FT"], input[name*="ubject" i]').first().inputValue().catch(()=>null);
if(!/^Recipients \| mmohamed@anyware\.software \| (Bcc|Cc) \| (Bcc|Cc) \| $/.test(out.recips)){out.abort='recipients unexpected';await shot('t-abort');return Object.assign(out,{calls:[...new Set(calls)]});}
await shot('t3-before-send');
step='send';await page.locator('button:text-is("Send")').first().click();await page.waitForTimeout(10000);
log('SENT template reply on ticket #2484 To mmohamed@anyware.software From Tech <tech@help-staging.anyware.software> (template QA FT 1865 H template)');
out.after=await lines(/QA FT 1865 H template|Sent|Not delivered|CONVERSATION/,8);await shot('t4-template-sent');
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('t-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
