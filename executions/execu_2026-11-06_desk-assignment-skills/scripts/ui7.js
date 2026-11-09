// 7 Nov UI: A-06 (6th target in the form), E-03 (RR method help texts)
await page.setViewportSize({width:1600,height:1000});
const o={};const dlg=()=>page.locator('[role=dialog]').last();const dt=async()=>(await dlg().count())?(await dlg().innerText()):'(no dialog)';
const shot=n=>page.screenshot({path:'../screenshots/'+n+'.png'});
const ready=async()=>{await page.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);};
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await ready();
// A-06
await page.getByRole('button',{name:/^New Rule$/}).first().click();await page.waitForTimeout(2000);
await dlg().getByRole('textbox').first().fill('QA AS6 A06 ui (not saved)');
const add=dlg().locator('button').filter({hasText:/Add Target/i});
o.clicks=[];for(let i=0;i<6;i++){const dis=await add.first().isDisabled().catch(()=>'?');o.clicks.push(dis);if(dis===true)break;await add.first().click().catch(()=>{});await page.waitForTimeout(900);}
const txt=await dt();o.targetCount=(txt.match(/Target \d/g)||[]).length;o.after=txt.replace(/\s+/g,' ').slice(-700);
o.addTitle=await add.first().getAttribute('title').catch(()=>null);o.addAria=await add.first().getAttribute('aria-disabled').catch(()=>null);
await add.first().hover().catch(()=>{});await page.waitForTimeout(800);o.tooltip=(await page.locator('[role=tooltip]').allInnerTexts().catch(()=>[])).join(' | ');
await dlg().evaluate(e=>{const s=[...e.querySelectorAll('*')].find(x=>x.scrollHeight>x.clientHeight+20);if(s)s.scrollTop=s.scrollHeight;});await page.waitForTimeout(500);
await shot('ui-16-five-targets');
await dlg().getByRole('button',{name:/^Cancel$/}).click().catch(()=>page.keyboard.press('Escape'));await page.waitForTimeout(1500);
o.discard=(await page.locator('[role=alertdialog],[role=dialog]').last().innerText().catch(()=>'')).slice(0,300);
const dis=page.getByRole('button',{name:/Discard|Leave|Yes/i});if(await dis.count()){await dis.first().click();await page.waitForTimeout(1000);}
// E-03
await page.getByRole('tab',{name:/^Round Robin$/}).click();await page.waitForTimeout(3500);
await page.getByRole('button',{name:/^New Rule$/}).first().click();await page.waitForTimeout(2000);
await dlg().getByRole('textbox').first().fill('QA AS6 E03 ui (not saved)');
await dlg().locator('button').filter({hasText:/Add Target/i}).first().click().catch(()=>{});await page.waitForTimeout(1500);
o.rrTarget=(await dt()).replace(/\s+/g,' ').slice(0,2500);
await shot('ui-17-rr-target');
await page.keyboard.press('Escape');await page.waitForTimeout(800);await page.keyboard.press('Escape');
return o;
