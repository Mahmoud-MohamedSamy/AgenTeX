// node zrun.js <task.js> [headed]  — headless Edge on a COPY of r19-zd.json (never written back). task exports async (page, z, ctx) => result
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const SP='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad';
const src=SP+'/r19-zd.json', cp=SP+'/r19-zd-run-'+process.pid+'.json'; fs.copyFileSync(src,cp);
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:process.argv[3]!=='headed',channel:'msedge'});const ctx=await b.newContext({storageState:cp,viewport:{width:1600,height:900}});const page=await ctx.newPage();
for(let a=0;a<3;a++){try{await page.goto(process.env.URL||'https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'commit',timeout:90000});break;}catch(e){if(a==2)throw e;await page.waitForTimeout(10000);}}
for(let k=0;k<40;k++){await page.waitForTimeout(1000);if(/accounts\.zoho/.test(page.url())){console.log('SIGNED OUT');process.exit(3);} if(await page.evaluate(()=>/crmcsr=/.test(document.cookie)))break;}
await page.waitForTimeout(4000);
const orgId=process.env.ZORG||'';
const z=async(m,u,body,raw)=>page.evaluate(async([m,u,body,orgId,raw])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const h={'X-ZCSRF-TOKEN':'crmcsrfparam='+c};if(orgId)h.orgId=orgId;if(body&&!raw)h['Content-Type']='application/json';
const r=await fetch(u,{method:m,credentials:'include',headers:h,body:body?(raw?body:JSON.stringify(body)):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,800)};},[m,u,body,orgId,raw]);
const task=require(path.resolve(process.argv[2]));const res=await task(page,z,ctx);console.log(typeof res==='string'?res:JSON.stringify(res,null,1));
await b.close();fs.unlinkSync(cp);})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);try{fs.unlinkSync(cp)}catch(_){}process.exit(1)});
