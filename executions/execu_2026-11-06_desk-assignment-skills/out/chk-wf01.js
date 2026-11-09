const path=require('path');const {chromium}=require(path.join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation','node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({channel:'msedge'});const p=await b.newPage({viewport:{width:1000,height:1100}});const net=[];
p.on('response',r=>{if(r.url().includes('web-forms'))net.push(r.status()+' '+r.request().method()+' '+r.url().split('/').pop().slice(0,12));});
await p.goto('file:///'+path.resolve(__dirname,'../evidence/d14/webform01-test.html').split(path.sep).join('/'));
let f=null;for(let i=0;i<30;i++){await p.waitForTimeout(2000);f=p.frames().find(x=>x.url().includes('embed/feedback'));if(f&&await f.locator('button').count())break;}
const labels=f?await f.$$eval('label',e=>e.map(x=>x.innerText.trim()).filter(Boolean)):[];const btns=f?await f.$$eval('button',e=>e.map(x=>x.innerText.trim())):[];
await p.screenshot({path:path.resolve(__dirname,'../screenshots/ev-webform01-test-page.png')});console.log(JSON.stringify({labels,btns,net}));await b.close();})();
