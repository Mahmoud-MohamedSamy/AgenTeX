await page.setViewportSize({width:1600,height:1000});
const o={};const dlgText=async()=>{const d=page.locator('[role=dialog]').last();return (await d.count())?(await d.innerText()).slice(0,3000):'(no dialog)';};
const shot=async n=>page.screenshot({path:'../screenshots/'+n+'.png'});
const ready=async()=>{await page.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);};
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await ready();
// Direct: New Rule
await page.getByRole('button',{name:/^New Rule$/}).first().click();await page.waitForTimeout(2500);
o.directNew=await dlgText();await shot('ui-02-direct-new');
o.directChecks=await page.locator('[role=dialog] input[type=checkbox], [role=dialog] [role=checkbox], [role=dialog] [role=switch]').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.closest('label')?.innerText||e.id||'?').slice(0,50)+':'+(e.checked??e.getAttribute('aria-checked'))));
// save empty
const saveBtn=page.locator('[role=dialog] button').filter({hasText:/^(Save|Create)/});o.saveBtns=await saveBtn.allInnerTexts();
if(await saveBtn.count()){await saveBtn.first().click();await page.waitForTimeout(1500);o.directEmptySave=await dlgText();await shot('ui-03-direct-empty-save');}
// add target without name
const addT=page.locator('[role=dialog] button').filter({hasText:/Add Target/i});o.addTargetCount=await addT.count();
if(await addT.count()){await addT.first().click();await page.waitForTimeout(1500);o.afterAddTargetNoName=(await dlgText()).slice(0,800);}
await page.keyboard.press('Escape');await page.waitForTimeout(1500);
// Round Robin tab
await page.getByRole('tab',{name:/^Round Robin$/}).click();await page.waitForTimeout(4000);
const b=await page.innerText('body');const i=b.lastIndexOf('Round Robin');o.rrList=b.slice(b.indexOf('Round Robin\n'),b.indexOf('Round Robin\n')+1500);await shot('ui-04-rr-list');
o.rrCombos=await page.locator('main [role=combobox], main select').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.innerText||e.value||'').slice(0,60)));
await page.getByRole('button',{name:/^New Rule$/}).first().click();await page.waitForTimeout(2500);o.rrNew=await dlgText();await shot('ui-05-rr-new');
await page.keyboard.press('Escape');await page.waitForTimeout(1500);
// preferences: look for a button/menu with Preferences
const pref=page.getByRole('button',{name:/Preferences|More/i});o.prefButtons=await pref.allInnerTexts().catch(()=>[]);
if(await pref.count()){await pref.first().click();await page.waitForTimeout(1500);const mi=page.getByRole('menuitem',{name:/Preferences/i});if(await mi.count()){await mi.first().click();await page.waitForTimeout(2500);}o.prefs=await dlgText();await shot('ui-06-rr-prefs');await page.keyboard.press('Escape');await page.waitForTimeout(1000);}
// Team Assignment tab
await page.getByRole('tab',{name:/^Team Assignment$/}).click();await page.waitForTimeout(4000);const b2=await page.innerText('body');o.team=b2.slice(b2.indexOf('Team Assignment\n'),b2.indexOf('Team Assignment\n')+1200);await shot('ui-07-team');
await page.getByRole('tab',{name:/^Notifications$/}).click();await page.waitForTimeout(3000);const b3=await page.innerText('body');o.notif=b3.slice(b3.lastIndexOf('Notifications'),b3.lastIndexOf('Notifications')+800);
o.hasBacklogTab=/\bBacklog\b/.test(await page.locator('[role=tablist]').allInnerTexts().then(x=>x.join(' ')));
return o;
