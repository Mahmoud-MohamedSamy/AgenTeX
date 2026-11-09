// 7 Nov B-5 evidence: Holidays list page + rule "QA AS6 B08 holiday" edit (read-only, closed with Cancel)
await page.setViewportSize({width:1600,height:1000});
const o={};const shot=n=>page.screenshot({path:'../screenshots/'+n+'.png'});
await page.goto(H+'/settings/organization/holidays',{waitUntil:'commit',timeout:120000});await page.waitForFunction(()=>/QA AS6 HOL/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);
o.hol=(await page.innerText('body')).replace(/\s+/g,' ').match(/.{0,300}QA AS6 HOL.{0,400}/)?.[0];await shot('ev-B5-holiday-lists');
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit',timeout:120000});await page.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
const row=page.locator('li,[role=row],[draggable],div').filter({hasText:'QA AS6 B08 holiday'}).filter({has:page.getByRole('button',{name:/Edit/i})}).last();o.row=await row.count();
if(o.row){await row.getByRole('button',{name:/Edit/i}).first().click();await page.waitForTimeout(3000);
 const d=page.locator('[role=dialog]').last();const t=await d.innerText();o.dlg=t.replace(/\s+/g,' ').slice(0,1500);
 const tg=d.getByText('QA AS6 HOL t1').first();if(await tg.count())await tg.scrollIntoViewIfNeeded().catch(()=>{});await page.waitForTimeout(800);
 await shot('ev-B5-rule-target1');o.box=await d.boundingBox();
 const c=d.getByRole('button',{name:/^Cancel$/});if(await c.count())await c.first().click();}
await page.goto(H+'/settings/organization/holidays',{waitUntil:'commit',timeout:120000});
return o;
