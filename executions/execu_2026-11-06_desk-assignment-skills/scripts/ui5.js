await page.setViewportSize({width:1600,height:1000});
const o={};const shot=async n=>page.screenshot({path:'../screenshots/'+n+'.png'});
let alerted=false;page.on('dialog',async d=>{alerted=true;await d.dismiss();});
await page.goto(H+'/settings/customization/skills',{waitUntil:'commit'});
await page.waitForFunction(()=>/Active skills/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2000);
// department picker: element right after the "Department" label
const depBtn=page.locator('main').getByText('Customer Support',{exact:true}).first();o.depTag=await depBtn.evaluate(e=>e.tagName+' '+(e.closest('button,[role=combobox],select')?.tagName||'')).catch(e=>'none');
const sel=page.locator('main select').first();
if(await sel.count()){o.selOptions=(await sel.locator('option').allInnerTexts()).length;await sel.selectOption({label:'QA AS6 Dept A'});}
else{await depBtn.click();await page.waitForTimeout(1000);const opt=page.getByRole('option',{name:'QA AS6 Dept A'}).or(page.getByText('QA AS6 Dept A',{exact:true}));await opt.first().click();}
await page.waitForTimeout(3500);const b=await page.innerText('main');o.deptA=b.slice(b.indexOf('Active skills'),b.indexOf('Active skills')+1500);
o.xssAlert=alerted;o.xssShownAsText=b.includes('QA AS6 <img src=x onerror=alert(1)>');await shot('ui-12-skills-deptA');
const search=page.getByPlaceholder(/Search skills/i);if(await search.count()){await search.fill('sk2');await page.waitForTimeout(1500);o.searchSk2=[...new Set(((await page.innerText('main')).match(/QA AS6 sk\d/g)||[]))];await search.fill('');await page.waitForTimeout(800);}
const st=page.locator('main').getByText('All statuses',{exact:true}).first();if(await st.count()){const tag=await st.evaluate(e=>e.tagName);o.statusTag=tag;}
// language
const hdr=page.locator('header').getByText(/^EN$/).first();o.langFound=await hdr.count();
if(o.langFound){await hdr.click();await page.waitForTimeout(1000);o.langMenu=(await page.locator('[role=menu],[role=listbox]').last().innerText().catch(()=>'')).slice(0,200);const ar=page.getByText(/العربية|Arabic/).first();if(await ar.count()){await ar.click();await page.waitForTimeout(7000);}}
o.dir=await page.evaluate(()=>document.documentElement.dir);o.lang=await page.evaluate(()=>document.documentElement.lang);
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.waitForFunction(()=>/[؀-ۿ]{3,}/.test(document.body.innerText)&&document.querySelectorAll('[role=switch]').length>2,null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);
const ab=await page.innerText('main');const i=ab.search(/[؀-ۿ]/);o.arMain=ab.slice(Math.max(0,ab.length-1200));
await shot('ui-13-arabic');
await page.locator('main button').filter({hasText:/[؀-ۿ]/}).filter({has:page.locator('svg')}).first().click().catch(()=>{});await page.waitForTimeout(2000);
const dl=page.locator('[role=dialog]').last();if(await dl.count()){await dl.locator('button[type=submit], button').filter({hasText:/حفظ/}).first().click().catch(()=>{});await page.waitForTimeout(1500);o.arDialog=(await dl.innerText()).slice(0,1500);await shot('ui-14-arabic-dialog');await page.keyboard.press('Escape');}
// restore English
const hdr2=page.locator('header').getByText(/^(AR|ع|عربي)$/).first();if(await hdr2.count()){await hdr2.click();await page.waitForTimeout(800);await page.getByText(/^English$|^EN$/).first().click().catch(()=>{});await page.waitForTimeout(4000);}
o.langAfter=await page.evaluate(()=>document.documentElement.lang+'/'+document.documentElement.dir);
return o;
