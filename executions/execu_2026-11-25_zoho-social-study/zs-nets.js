const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const D=__dirname;
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge',args:['--disable-http2']});
const ctx=await b.newContext({storageState:path.join(D,'z1717.json'),viewport:{width:1600,height:1000}});const page=await ctx.newPage();
await page.goto('https://social.zoho.com/',{waitUntil:'domcontentloaded',timeout:120000});
for(let k=0;k<60;k++){await page.waitForTimeout(1000);if((await page.innerText('body').catch(()=>'')).length>400)break;}
const names=['Facebook','X','LinkedIn','Instagram','Google Business Profile','YouTube','Pinterest','TikTok','Mastodon','Threads','Telegram','WhatsApp','Bluesky','Snapchat','Arattai'];
const out={};for(const n of names){const a=page.locator(`a:visible`,{hasText:new RegExp('^'+n.replace(/ /g,'\s*')+'$')}).first();
 let ok=await a.count();if(!ok){const t=page.locator(`[title="${n}"]:visible, [data-title="${n}"]:visible`).first();if(await t.count()){await t.click().catch(()=>{});ok=1;}}else await a.click().catch(()=>{});
 await page.waitForTimeout(1500);
 out[n]=await page.evaluate(()=>{const m=[...document.querySelectorAll('body *')].find(e=>e.offsetParent&&/Get started by setting up a Brand/.test(e.innerText||'')&&e.innerText.length<1500);return m?m.innerText.replace(/Get started by setting up a Brand/,'').trim():'';});
 if(n==='LinkedIn'||n==='Instagram'||n==='WhatsApp')await page.screenshot({path:path.join(D,'shots','net-'+n+'.png')});}
fs.writeFileSync(path.join(D,'text','networks.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));await b.close();})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1);});
