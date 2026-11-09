// B-3 evidence: Dept A Team Assignment OFF -> manual team assign via API and via the ticket screen.
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const S=n=>page.screenshot({path:'../screenshots/'+n+'.png'});
await page.setViewportSize({width:1600,height:1000});
o.off=sh(await api('PUT','/desk/departments/'+IDS.DA+'/team-assignment',{enabled:false}));
LED('B-3 evidence 7 Nov: Dept A Team Assignment OFF temporarily');
const t=await mkTicket('QA AS6 B3 team assignment off',IDS.DA,{},'B-3 evidence');o.ticket=t.id;await sleep(3000);
o.api=sh(await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:null,team_id:IDS.TA}));
await sleep(2000);o.after=await own(t.id);
// settings screen
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);
const tab=page.getByRole('tab',{name:/Team Assignment/i});if(await tab.count()){await tab.first().click();await page.waitForTimeout(3000);}
o.teamTab=(await page.innerText('main')).replace(/\s+/g,' ').match(/.{0,100}QA AS6 Dept A.{0,200}/)?.[0];
await S('ev-B3-team-assignment-tab');
// ticket screen: open the owner picker
await page.goto(H+'/views/all/tickets/'+t.id,{waitUntil:'commit'});await page.waitForFunction(()=>/QA AS6 B3 team assignment off/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
const own1=page.getByText('Ticket Owner',{exact:false}).first();o.ownLbl=await own1.count();
const box=await own1.boundingBox().catch(()=>null);o.box=box;
await S('ev-B3-ticket');
if(box){await page.mouse.click(box.x+60,box.y+box.height+22);await page.waitForTimeout(2500);}
o.picker=(await page.locator('[role=dialog],[role=listbox],[role=menu],[data-radix-popper-content-wrapper]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,800);
o.pickerTabs=await page.getByRole('tab').allInnerTexts().catch(()=>[]);
await S('ev-B3-picker');
return o;
