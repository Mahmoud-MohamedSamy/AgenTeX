// node gs/zrun.js <script.js>  Zoho CRM org946877290 via read-only copy r19-gs-z.json (never saved back). Script gets page, sleep, shot, text, log, zapi(method,path,body) (in-page fetch with CSRF).
const path=require('path'),fs=require('fs');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/r19-gs-z.json';
const RAW=path.join(__dirname,'..','..','screenshots','raw');
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});const ctx=await b.newContext({storageState:S,viewport:{width:1600,height:900}});const page=await ctx.newPage(); page.setDefaultTimeout(30000);
const lines=[];const log=(...a)=>lines.push(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const sleep=ms=>page.waitForTimeout(ms); const shot=async n=>{await page.screenshot({path:path.join(RAW,n)});log('shot '+n);}; const text=()=>page.innerText('body').catch(()=>'');
const zapi=(m,p,body)=>page.evaluate(async([m,p,body])=>{const tok=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||''; const r=await fetch(p,{method:m,headers:{'X-ZCSRF-TOKEN':'crmcsrfparam='+tok,'content-type':'application/json','X-CRM-ORG':'946877290'},body:body?JSON.stringify(body):undefined,credentials:'include'}); const t=await r.text(); return {s:r.status,t:t.slice(0,8000000)};},[m,p,body]);
let out; try{ out=await (new Function('page','sleep','shot','text','log','zapi','require','return (async()=>{'+fs.readFileSync(process.argv[2],'utf8')+'})()'))(page,sleep,shot,text,log,zapi,require);}catch(e){out={ERR:String(e.message).split('\n')[0]}; await page.screenshot({path:path.join(RAW,'zoho-gs-error.png')}).catch(()=>{});}
await b.close(); console.log(JSON.stringify({log:lines,out},null,1));})();
