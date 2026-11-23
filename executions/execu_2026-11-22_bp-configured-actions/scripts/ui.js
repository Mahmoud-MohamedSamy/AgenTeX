const path=require('path');const S=process.argv[2];const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({storageState:S+'/owner.json',viewport:{width:1600,height:950}});const pg=await ctx.newPage();
 await pg.goto('https://staging-desk.taviportal.com/views/all/tickets/f46a195a-5e4d-40a9-818a-83c412348876',{waitUntil:'domcontentloaded',timeout:120000});
 await pg.getByText('View configured actions').first().waitFor({timeout:90000});await pg.waitForTimeout(3000);
 await pg.screenshot({path:S+'/now-ticket.png'});
 await pg.getByText('View configured actions').first().click();await pg.waitForTimeout(2500);
 const dlg=pg.locator('[role=dialog]').last();console.log((await dlg.innerText()).replace(/\n+/g,' | '));
 await pg.screenshot({path:S+'/now-popup.png'});await ctx.storageState({path:S+'/owner.json'});await b.close();})().catch(e=>{console.error(e.message.split('\n')[0]);process.exit(1)});
