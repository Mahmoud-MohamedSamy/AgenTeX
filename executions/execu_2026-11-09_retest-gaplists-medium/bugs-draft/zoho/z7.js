// Read-only: open Task Owner picker in each department's Add Task form; nothing is submitted.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const txt=async p=>(await p.innerText('body')).replace(/\s+/g,' ');
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tasks/new',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(14000);
const depts=[];
for(let i=0;i<3;i++){
 const before=await txt(page);
 await page.getByText('Fathy Mehanna').first().click().catch(e=>console.log('own',e.message));await page.waitForTimeout(3000);
 const after=await txt(page);
 const i1=after.indexOf('Task Owner');console.log('DEPT',page.url().split('/')[5],'OWNER LIST:',after.slice(i1,i1+500));
 await page.screenshot({path:`raw/task-owner-${page.url().split('/')[5]}.png`});
 await page.keyboard.press('Escape');await page.waitForTimeout(800);
 // switch department via top bar
 const cur=page.url().split('/')[5];
 await page.locator('text=/^(Tech|Marketing|Haytham Mohamed)$/').first().click().catch(e=>console.log('sw',e.message));await page.waitForTimeout(2500);
 const names=['Marketing','Haytham Mohamed','Tech'];const target=names[i];
 await page.getByText(target,{exact:true}).last().click().catch(e=>console.log('pick',e.message));await page.waitForTimeout(6000);
 console.log('after switch url',page.url());
 // discard prompt if any
 const d=page.locator('text=/^(Discard|Leave|Yes|OK)$/');if(await d.count()){console.log('prompt:',(await txt(page)).slice(0,200));await d.first().click();await page.waitForTimeout(3000)}
 const slug=page.url().split('/')[5];
 if(!/tasks\/new/.test(page.url())){await page.goto(`https://desk.zoho.com/agent/techsolutionsegypt/${slug}/tasks/new`,{waitUntil:'domcontentloaded'});await page.waitForTimeout(12000)}
}
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
