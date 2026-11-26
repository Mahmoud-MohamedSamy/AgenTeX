// node zs-walk.js <state> <routes,comma> [prefix]  Edge with HTTP/2 off; visit Social hash routes; screenshot + full text per route. Read-only.
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const D=__dirname;
(async()=>{const [st,routes,pre='r']=process.argv.slice(2);
const b=await chromium.launch({headless:false,channel:'msedge',args:['--disable-http2']});
const ctx=await b.newContext({storageState:path.join(D,st),viewport:{width:1600,height:900}});const page=await ctx.newPage();
let errs=0;page.on('requestfailed',r=>{if(/zohocdn/.test(r.url()))errs++;});
await page.goto('https://social.zoho.com/',{waitUntil:'domcontentloaded',timeout:120000});
for(let k=0;k<60;k++){await page.waitForTimeout(1000);const t=await page.innerText('body').catch(()=>'');if(t.length>400)break;}
const base=page.url().replace(/#.*$/,'');console.log('BASE',base,'cdnErr',errs);
for(const r of routes.split(',')){await page.goto(base+'#'+r).catch(()=>{});await page.waitForTimeout(9000);
 const n=pre+'-'+r.replace(/\//g,'-');await page.screenshot({path:path.join(D,'shots',n+'.png')});
 const t=await page.innerText('body').catch(()=>'');fs.writeFileSync(path.join(D,'text',n+'.txt'),t);console.log('==',r,t.length);}
await b.close();})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1);});
