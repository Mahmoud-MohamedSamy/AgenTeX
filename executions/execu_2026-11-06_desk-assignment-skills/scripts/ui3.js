await page.setViewportSize({width:1600,height:1000});
const o={};const dlg=()=>page.locator('[role=dialog]').last();const dlgText=async()=>(await dlg().count())?(await dlg().innerText()).slice(0,3000):'(no dialog)';
const shot=async n=>page.screenshot({path:'../screenshots/'+n+'.png'});
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});
await page.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);
await page.getByRole('tab',{name:/^Round Robin$/}).click();await page.waitForTimeout(3000);
// choose Dept A
const dep=page.locator('main').getByRole('combobox').first();o.depCombo=await dep.count();
if(o.depCombo){await dep.click();await page.waitForTimeout(1000);const opt=page.getByRole('option',{name:'QA AS6 Dept A'});if(await opt.count())await opt.click();else{await page.keyboard.type('QA AS6 Dept A');await page.waitForTimeout(800);await page.keyboard.press('Enter');}await page.waitForTimeout(3000);}
const b=await page.innerText('main');o.rrDeptA=b.slice(b.indexOf('Round Robin Rules'),b.indexOf('Round Robin Rules')+900);
// kebab → preferences
const kebab=page.locator('main button[aria-haspopup], main button[aria-label*="ore"], main button[aria-label*="ption"]');o.kebabs=await kebab.evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')||e.innerText));
for(let i=0;i<await kebab.count();i++){await kebab.nth(i).click().catch(()=>{});await page.waitForTimeout(800);const mi=page.getByRole('menuitem');if(await mi.count()){o.menu=await mi.allInnerTexts();const p=page.getByRole('menuitem',{name:/Preferences/i});if(await p.count()){await p.first().click();await page.waitForTimeout(2500);break;}}await page.keyboard.press('Escape');}
o.prefs=await dlgText();await shot('ui-06-rr-prefs');
o.prefControls=await dlg().locator('[role=switch],input,[role=combobox],select').evaluateAll(es=>es.map(e=>e.tagName+':'+(e.getAttribute('aria-label')||e.getAttribute('name')||e.getAttribute('type')||'')+':'+(e.getAttribute('aria-checked')??e.value??'')));
// turn on agent level threshold and look at row
const agentSw=dlg().getByRole('switch',{name:/Agent level/i});o.agentSw=await agentSw.count();
if(o.agentSw){await agentSw.click();await page.waitForTimeout(1200);o.prefsAgentOn=(await dlgText()).slice(0,2500);await shot('ui-08-prefs-agent-on');
 const save=dlg().getByRole('button',{name:/^Save$/});await save.click();await page.waitForTimeout(1500);o.prefsSaveNoAgent=(await dlgText()).slice(0,2500);await shot('ui-09-prefs-save-norow');}
// dept threshold invalid
const deptSw=dlg().getByRole('switch',{name:/Department wise/i});if(await deptSw.count()&&(await deptSw.getAttribute('aria-checked'))!=='true'){await deptSw.click();await page.waitForTimeout(800);}
const num=dlg().locator('input[type=number], input[inputmode=numeric]');o.numInputs=await num.count();
if(o.numInputs){await num.first().fill('201');await dlg().getByRole('button',{name:/^Save$/}).click();await page.waitForTimeout(1500);o.prefs201=(await dlgText()).slice(0,2500);await shot('ui-10-prefs-201');}
await dlg().getByRole('button',{name:/^Cancel$/}).click().catch(()=>page.keyboard.press('Escape'));await page.waitForTimeout(1500);
o.afterCancelPrefs=JSON.stringify(await page.evaluate(async()=>1));
// Direct target pick lists
await page.getByRole('tab',{name:/^Direct Assignment$/}).click();await page.waitForTimeout(2500);
await page.getByRole('button',{name:/^New Rule$/}).first().click();await page.waitForTimeout(2000);
await dlg().getByLabel(/Rule name/i).fill('QA AS6 UI draft (not saved)');
await dlg().getByRole('button',{name:/Add Target/i}).click();await page.waitForTimeout(2000);o.target=(await dlgText()).slice(0,3000);await shot('ui-11-direct-target');
o.targetCombos=await dlg().locator('[role=combobox],select').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||'')+'='+(e.innerText||e.value||'').slice(0,40)+(e.disabled||e.getAttribute('aria-disabled')==='true'?' [disabled]':'')));
await page.keyboard.press('Escape');await page.waitForTimeout(800);await page.keyboard.press('Escape');
return o;
