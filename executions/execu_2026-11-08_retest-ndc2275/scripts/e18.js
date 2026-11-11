// E-18 30-day rule workaround. node e18.js inv. Owner session only. Read-only in 'inv'.
const fs=require('fs'),path=require('path');global.path=path;const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const H='https://staging-desk.taviportal.com',API=H+'/api/v1';
const OUT=path.join(__dirname,'..','out');const MODE=process.argv[2]||'inv';const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const IDS=JSON.parse(fs.readFileSync(path.join(P,'executions/execu_2026-11-06_desk-assignment-skills/out/ids.json'),'utf8'));
const LED=m=>fs.appendFileSync(path.join(OUT,'../ledger.md'),'- '+new Date().toISOString().slice(0,19)+' E18 '+m+'\n');const W=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({storageState:path.join(OUT,'owner.json')});const pg=await ctx.newPage();
 await pg.goto(H+'/',{waitUntil:'commit',timeout:120000});await pg.waitForTimeout(7000);
 const tok=async()=>((await ctx.cookies()).find(x=>x.name==='aw_staging_access_token')||{}).value;
 const api=async(m,p,body)=>{const t=await tok();if(!t)throw new Error('SIGNED_OUT');let r;for(let tr=0;;tr++){try{r=await ctx.request.fetch(API+p,{method:m,headers:{authorization:'Bearer '+t,'x-app-key':'desk',...(body!==undefined?{'content-type':'application/json'}:{})},data:body!==undefined?JSON.stringify(body):undefined,failOnStatusCode:false,timeout:120000});break;}catch(e){if(tr>=4||!/ECONNRESET|ETIMEDOUT|ENOTFOUND|socket hang up|Timeout/i.test(e.message))throw e;await new Promise(z=>setTimeout(z,5000*(tr+1)));}}if(r.status()===429)throw new Error('STOP 429');const x=await r.text();let j=null;try{j=JSON.parse(x)}catch(e){}return{s:r.status(),j,t:x.slice(0,400)};};
 const arr=x=>Array.isArray(x)?x:(x&&(x.items||x.data||x.results||x.records||x.fields))||[];
 const fl=r=>{const o={id:r.id,created_at:r.created_at};for(const x of (r.data||[])){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value!==undefined?v.value:(v.kind==='null'?null:v);}return o;};
 const R={};
 try{ global.api=api;global.pg=pg;global.H=H;global.OUT=OUT;global.arr=arr;global.fl=fl;global.W=W;global.LED=LED;global.IDS=IDS;global.T=T;
  const mod=require(path.join(__dirname,'e18-'+MODE+'.js'));Object.assign(R,await mod());
 }finally{await ctx.storageState({path:path.join(OUT,'owner.json')}).catch(()=>{});await b.close();}
 fs.writeFileSync(path.join(OUT,'e18-'+MODE+'.json'),JSON.stringify(R,null,1));console.log(JSON.stringify(R,null,1).replace(/eyJ[A-Za-z0-9._-]{20,}/g,'<jwt>').slice(0,6000));
})().catch(e=>{console.error('ERR',String(e.message).split('Call log')[0]);process.exit(1);});
