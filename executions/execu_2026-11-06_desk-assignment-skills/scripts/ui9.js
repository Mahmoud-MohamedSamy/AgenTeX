// 7 Nov UI: explore the New Ticket form
await page.setViewportSize({width:1600,height:1000});
const o={};const shot=n=>page.screenshot({path:'../screenshots/'+n+'.png'});
await page.goto(H+'/views/all/tickets',{waitUntil:'commit'});await page.waitForFunction(()=>/All Tickets/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
await page.locator('header button').filter({has:page.locator('svg')}).first().click().catch(()=>{});
const plus=page.getByRole('button',{name:/^(New|Create|Add)\b|^\+$/}).first();o.plusN=await plus.count();
await page.mouse.click(965,28);await page.waitForTimeout(2500);
o.menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).slice(0,300);
const nt=page.getByRole('menuitem',{name:/Ticket/i});if(await nt.count()){await nt.first().click();await page.waitForTimeout(4000);}
o.url=page.url();
o.form=(await page.locator('[role=dialog]').last().innerText().catch(()=>page.innerText('main'))).replace(/\s+/g,' ').slice(0,2500);
o.labels=await page.locator('[role=dialog] label, main label').allInnerTexts().catch(()=>[]);
await shot('ui-20-new-ticket');
return o;
