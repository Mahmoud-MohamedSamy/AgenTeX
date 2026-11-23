// node ov.js <url-path> <shot-name>  — open page with owner session, list API calls, screenshot, print visible text
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/14f7a636-ad22-4c58-b83c-7b2ea2e79885/scratchpad';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const [p,name,w]=process.argv.slice(2);
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({storageState:S+'/r18-o.json',viewport:{width:+(w||1600),height:1000}});const pg=await ctx.newPage();
const calls=[];pg.on('response',r=>{const u=r.url();if(/\/api\//.test(u)&&!/iam\/auth/.test(u))calls.push(r.status()+' '+r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,''))});
await pg.goto('https://staging-desk.taviportal.com/'+p,{waitUntil:'commit',timeout:120000});await pg.waitForTimeout(20000);
await pg.screenshot({path:'../screenshots/raw/'+name+'.png',fullPage:true});
console.log('URL',pg.url());console.log(calls.join('\n'));console.log('----TEXT');console.log((await pg.innerText('main').catch(()=>pg.innerText('body'))).slice(0,3000));await b.close();})();
