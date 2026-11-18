const R={};const ID='fc4d477e-b615-494c-8caa-64fc4a829e4d';const U=H+'/settings/automation/workflow-rules/'+ID;
const st=[];page.on('response',r=>{if(r.url().includes(ID)&&r.request().method()!=='GET')st.push('A '+r.request().method()+' '+r.status());});
await page.goto(U,{waitUntil:'domcontentloaded'});await page.getByText('Instant actions').first().waitFor({timeout:90000});await sleep(3000);
const B=await ctx.newPage();B.on('response',r=>{if(r.url().includes(ID)&&r.request().method()!=='GET')st.push('B '+r.request().method()+' '+r.status());});
await B.goto(U,{waitUntil:'domcontentloaded'});await B.getByText('Instant actions').first().waitFor({timeout:90000});await B.waitForTimeout(3000);
await B.getByRole('button',{name:'Edit rule name'}).first().click();await B.waitForTimeout(500);const bn=B.locator('input:focus');await bn.fill('QA RT18 WF 2958 renamed in tab B');await bn.press('Enter');await B.waitForTimeout(600);
await B.locator('main').last().getByRole('button',{name:/^Save$/}).first().click();await B.waitForTimeout(4000);
R.bToasts=await B.locator('[data-sonner-toast]').allInnerTexts().catch(()=>[]);
await B.screenshot({path:require('path').join(process.cwd(),'..','screenshots','raw','2965-1-tabB-renamed.png')});
// tab A: change description and save
await page.bringToFront();
await page.getByText('Add Description').first().click();await sleep(600);const dd=page.locator('textarea:focus, input:focus');await dd.fill('QA RT18 2965 description from tab A');await dd.press('Tab').catch(()=>{});await sleep(500);
await shot('2965-2-tabA-before-save.png');
await page.locator('main').last().getByRole('button',{name:/^Save$/}).first().click();await sleep(4000);
R.aDialog=(await page.getByRole('alertdialog').or(page.getByRole('dialog')).allInnerTexts().catch(()=>[])).map(x=>x.replace(/\s+/g,' '));
R.aToasts=await page.locator('[data-sonner-toast]').allInnerTexts().catch(()=>[]);
await shot('2965-3-tabA-conflict.png');R.st=[...st];
return R;
