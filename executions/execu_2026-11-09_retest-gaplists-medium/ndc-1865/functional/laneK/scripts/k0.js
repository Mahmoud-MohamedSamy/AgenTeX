const {chromium}=require('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/node_modules/playwright-core');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://staging-desk.taviportal.com/',{waitUntil:'commit',timeout:120000});
for(let i=0;i<12;i++){await p.waitForTimeout(10000);const t=(await p.innerText('body').catch(()=>'')).slice(0,200).replace(/\s+/g,' ');console.log(i,p.url().replace(/\?.*/,''),'|',t);if(await p.$('input[type=password]'))break;}
await p.screenshot({path:process.argv[2]});await b.close();})();
