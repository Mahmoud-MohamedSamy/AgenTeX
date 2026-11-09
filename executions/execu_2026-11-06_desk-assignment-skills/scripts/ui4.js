await page.setViewportSize({width:1600,height:1000});
const o={};const dlg=()=>page.locator('[role=dialog]').last();const dlgText=async()=>(await dlg().count())?(await dlg().innerText()).slice(0,2500):'(no dialog)';
const shot=async n=>page.screenshot({path:'../screenshots/'+n+'.png'});
let alerted=false;page.on('dialog',async d=>{alerted=true;await d.dismiss();});
// Skills page (Setup > Customization > Skills)
await page.goto(H+'/settings/customization/skills',{waitUntil:'commit'}).catch(()=>{});
await page.waitForFunction(()=>/Skill/.test(document.body.innerText)&&/Department/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
o.skillsUrl=page.url();
const dep=page.getByRole('combobox',{name:/Department/i});o.skDep=await dep.count();
if(o.skDep){await dep.first().click();await page.waitForTimeout(800);await page.getByRole('option',{name:'QA AS6 Dept A'}).click().catch(async()=>{await page.keyboard.type('QA AS6 Dept A');await page.keyboard.press('Enter');});await page.waitForTimeout(3000);}
const b=await page.innerText('main').catch(()=>page.innerText('body'));o.skillsText=b.slice(0,1800);await shot('ui-12-skills');
o.xssAlert=alerted;o.xssShownAsText=/QA AS6 <img src=x onerror=alert\(1\)>/.test(b);
o.filters=await page.locator('main input, main [role=combobox]').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').slice(0,40)));
const search=page.getByPlaceholder(/Search/i).last();if(await search.count()){await search.fill('sk2');await page.waitForTimeout(1500);o.searchSk2=(await page.innerText('main')).match(/QA AS6 sk\d/g);await search.fill('');}
// Team assignment off for Dept A → Teams tab in a direct target picker coming to Dept A
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2000);
o.anyDeptNote='checked via API (C-05 400 needs_department)';
// Arabic
const lang=page.getByRole('button',{name:/^EN/}).first();if(await lang.count()){await lang.click();await page.waitForTimeout(800);o.langOptions=await page.getByRole('menuitem').allInnerTexts().catch(()=>[]);const ar=page.getByRole('menuitem',{name:/عرب|Arabic|AR/});if(await ar.count()){await ar.first().click();await page.waitForTimeout(6000);}}
o.dir=await page.evaluate(()=>document.documentElement.dir||getComputedStyle(document.body).direction);
const ab=await page.innerText('main').catch(()=>'');o.arText=ab.slice(0,900);const lat=(ab.match(/[A-Za-z]{4,}/g)||[]).filter(w=>!/QA|AS6|Dept|Team|NDC|Customer|Support|Tech|Dev|Test|User|Samy|Mahmoud|Priority|Robin|Round|Members|Load|Based|Skill|Sequence|Agents|Selected|Tickets|Empty|Phone|Specialists|Experience|Classification|question|Accounting|Manual|invoice|Invoice|Finance|mimic|direct|assignment|rule|move|unassigned|pattern|both|update|first|restore|nnnn/i.test(w));o.latinLeft=[...new Set(lat)].slice(0,40);
await shot('ui-13-arabic');
await page.getByRole('button',{name:/^New Rule$|^قاعدة جديدة$/}).first().click().catch(()=>{});await page.waitForTimeout(2000);await dlg().getByRole('button').last().click().catch(()=>{});await page.waitForTimeout(1500);o.arDialog=(await dlgText()).slice(0,1200);await shot('ui-14-arabic-dialog');await page.keyboard.press('Escape');
// back to English
const lang2=page.getByRole('button',{name:/^(AR|ع)/}).first();if(await lang2.count()){await lang2.click();await page.waitForTimeout(800);const en=page.getByRole('menuitem',{name:/English|EN/});if(await en.count()){await en.first().click();await page.waitForTimeout(4000);}}
o.dirAfter=await page.evaluate(()=>document.documentElement.dir||'ltr');
return o;
