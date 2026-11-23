// read-only Zoho capture: node zoho-shots.js
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const R=P+'/executions/execu_2026-11-22_jam-fb154ab6';const {chromium}=require(P+'/node_modules/playwright-core');
const O='https://crm.zoho.com/crm/org946877290/settings/';
const pages=[['wf','workflow-rules'],['ar','assignment-rules'],['ap','approval-processes'],['rp','review-process'],['act','actions/email-notifications']];
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({viewport:{width:1500,height:900},storageState:R+'/zoho-state.json'});const p=await ctx.newPage();const res={};
for(const [k,u] of pages){await p.goto(O+u,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});await p.waitForTimeout(14000);
 await p.screenshot({path:R+'/evidence/raw/zoho-'+k+'.png'});const t=(await p.innerText('body').catch(()=>'')).replace(/\s+/g,' ');res[k]={url:p.url().replace(/[?].*$/,''),text:t.slice(0,700)};}
await b.close();console.log(JSON.stringify(res,null,1));})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1)});
