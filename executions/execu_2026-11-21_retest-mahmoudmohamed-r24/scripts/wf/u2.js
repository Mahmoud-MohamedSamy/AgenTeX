for(const p of ['/settings/automation/workflow-rules/executions','/settings/automation/execution-history','/settings/automation/workflow-rules/history','/settings/automation/workflow-executions','/settings/automation/workflow-rules/1effb0a3-74a1-4551-9ad1-10e55c392be3']){
await page.goto(H+p,{waitUntil:'domcontentloaded'});await sleep(7000);const t=(await text()).replace(/\s+/g,' ');const i=t.search(/xecution/);log(p,page.url().replace(H,''),i, t.slice(Math.max(0,i-100),i+200));}
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(1500);
const row=page.getByRole('row').filter({hasText:'QA RT19 WF 2962 ordinary'}).first(); log('row',await row.count());
const btns=row.getByRole('button');log('rowbtns',await btns.count());
if(await btns.count()){await btns.last().click();await sleep(800);log('menu',JSON.stringify(await page.getByRole('menuitem').allInnerTexts()));}
return {};
