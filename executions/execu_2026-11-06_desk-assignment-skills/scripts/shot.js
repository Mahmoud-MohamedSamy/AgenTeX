const path=require('path');const {chromium}=require(path.join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation','node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({channel:'msedge'});const p=await b.newPage({viewport:{width:1500,height:1000}});
await p.goto('file:///'+path.resolve(__dirname,'../report.html').split(path.sep).join('/'));await p.waitForTimeout(1500);
await p.screenshot({path:process.argv[2]+'/html-top.png'});
await p.locator('#evidence').scrollIntoViewIfNeeded();await p.screenshot({path:process.argv[2]+'/html-ev.png'});await b.close();})();
