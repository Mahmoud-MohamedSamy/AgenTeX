// node zs-ui.js  open panels that work without a channel; screenshot + text. Read-only (opens and cancels).
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const D=__dirname;
const steps=[['u-brand','null'],['u-manage','Reach.UI.managePopup()'],['u-settings','Reach.Utils.Settings_Config()'],['u-newpost','Reach.PublishPost.openNewPost(document.querySelector("a[onclick*=openNewPost]"),new MouseEvent("click"))'],['u-bulk','Reach.PublishPost.showBulkSchedule(document.querySelector("a[onclick*=showBulkSchedule]"))'],['u-newbrand','Reach.Utils.AddDefaultProfile()']];
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge',args:['--disable-http2']});
const ctx=await b.newContext({storageState:path.join(D,'z1717.json'),viewport:{width:1600,height:1000}});const page=await ctx.newPage();
await page.goto('https://social.zoho.com/',{waitUntil:'domcontentloaded',timeout:120000});
for(let k=0;k<60;k++){await page.waitForTimeout(1000);if((await page.innerText('body').catch(()=>'')).length>400)break;}
const base=page.url().replace(/#.*$/,'');
for(const [n,js] of steps){await page.goto(base+'#home').catch(()=>{});await page.reload();for(let k=0;k<40;k++){await page.waitForTimeout(1000);if((await page.innerText('body').catch(()=>'')).length>400)break;}
 let err='';if(js!=='null'){try{await page.evaluate(js);}catch(e){err=e.message.split('\n')[0];}}await page.waitForTimeout(7000);
 await page.screenshot({path:path.join(D,'shots',n+'.png')});
 const t=await page.evaluate(()=>{const vis=[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&e.offsetParent!==null&&e.innerText&&e.innerText.trim());return [...new Set(vis.map(e=>e.innerText.trim()))].join('\n');});
 fs.writeFileSync(path.join(D,'text',n+'.txt'),t);console.log('==',n,t.length,err,page.url().slice(-40));}
await b.close();})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1);});
