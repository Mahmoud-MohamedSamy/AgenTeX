// 7 Nov UI: A-12 save message, A-11 delete confirmation (QA rule "QA AS6 D04 A1 offline")
await page.setViewportSize({width:1600,height:1000});
const o={};const shot=n=>page.screenshot({path:'../screenshots/'+n+'.png'});
const toasts=async()=>(await page.locator('[role=status],[role=alert],[data-sonner-toast],li[data-type]').allInnerTexts().catch(()=>[])).filter(Boolean).join(' | ').slice(0,400);
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
const row=n=>page.locator('li,[role=row],[draggable],div').filter({hasText:n}).filter({has:page.getByRole('button',{name:/Edit/i})}).last();
// A-12
const r1=row('QA AS6 DA B02 pattern');o.r1=await r1.count();
await r1.getByRole('button',{name:/Edit/i}).first().click();await page.waitForTimeout(2500);
o.editName=await page.locator('[role=dialog]').last().getByRole('textbox').first().inputValue().catch(()=>null);
await page.locator('[role=dialog]').last().getByRole('button',{name:/^Save$/}).click();
let t='';for(let i=0;i<12&&!t;i++){await page.waitForTimeout(250);t=await toasts();}o.saveToast=t;await shot('ui-18-save-toast');
await page.waitForTimeout(2500);
// A-11
const r2=row('QA AS6 D04 A1 offline');o.r2=await r2.count();
await r2.getByRole('button',{name:/Delete/i}).first().click();await page.waitForTimeout(1500);
o.confirm=(await page.locator('[role=alertdialog],[role=dialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500);await shot('ui-19-delete-confirm');
const ok=page.locator('[role=alertdialog],[role=dialog]').last().getByRole('button',{name:/^Delete/i});
if(await ok.count()){await ok.first().click();let d='';for(let i=0;i<12&&!d;i++){await page.waitForTimeout(250);d=await toasts();}o.deleteToast=d;}
await page.waitForTimeout(2500);o.stillListed=/QA AS6 D04 A1 offline/.test(await page.innerText('main'));
return o;
