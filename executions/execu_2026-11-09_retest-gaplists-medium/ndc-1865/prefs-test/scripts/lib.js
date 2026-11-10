const B='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/prefs-test/';
const D=B+'evidence/raw/';const out={};const calls=[];
const fs=require('fs');const log=s=>fs.appendFileSync(B+'ledger.md',`- ${new Date().toISOString()} ${s}\n`);
const S=v=>({kind:'string',value:v});
const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4',AC='8410a6d0';
page.on('response',r=>{const u=r.url();const m=r.request().method();if(/api\/v1/.test(u)&&!/iam\/auth/.test(u)&&m!=='GET'&&!/heartbeat|resolved-batch|realtime|summaries/.test(u))calls.push(r.status()+' '+m+' '+u.replace(/.*api\/v1/,'').replace(/\?.*/,'').slice(0,100));});
const body=()=>page.locator('body').innerText().catch(()=>'');
const wt=async(re,ms=90000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await body();if(re.test(t))return t;await page.waitForTimeout(1500);}return null;};
const shot=n=>page.screenshot({path:D+n+'.png'});
const tokv=async()=>((await ctx.cookies()).find(x=>x.name==='aw_staging_access_token')||{}).value;
const crm=async(m,p,b)=>{let r;for(let k=0;k<6;k++){try{r=await ctx.request.fetch('https://staging-crm.taviportal.com/api/v1'+p,{method:m,headers:{authorization:'Bearer '+(await tokv()),'x-app-key':'crm','content-type':'application/json'},data:b?JSON.stringify(b):undefined,failOnStatusCode:false});break;}catch(e){if(k===5)throw e;await new Promise(z=>setTimeout(z,5000));}}const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status(),t:t.slice(0,1500),j};};
const carr=j=>Array.isArray(j&&j.data)?j.data:((j&&j.data&&(j.data.items||j.data.modules||j.data.records))||[]);
let crmMods=null;const crmMod=async name=>{if(!crmMods)crmMods=carr((await crm('GET','/modules')).j);return (crmMods.find(x=>new RegExp('^'+name+'$','i').test(x.api_name||x.apiName||x.name||''))||{}).id;};
const prefs=async()=>{const c=await api('GET','/desk/integrations/crm/config');const d=c.j&&c.j.data||{};return {on_crm_delete:d.on_crm_delete,on_crm_account_delete:d.on_crm_account_delete,on_desk_contact_delete:d.on_desk_contact_delete,on_desk_account_delete:d.on_desk_account_delete};};
// UI: set one preference dropdown and save
const setPref=async(current,option)=>{await page.setViewportSize({width:1280,height:900});
 await page.goto(H+"/settings/integrations/crm",{waitUntil:"commit",timeout:120000});await wt(/Parked/);
 await page.getByText("Configuration Details",{exact:true}).first().click();await wt(/Preferences/);await page.waitForTimeout(2500);
 const n0=calls.length;const btn=page.getByRole("button",{name:current,exact:true}).first();await btn.scrollIntoViewIfNeeded();await btn.click();await page.waitForTimeout(1200);
 await page.getByRole("option",{name:option,exact:true}).first().click({timeout:15000});await page.waitForTimeout(3000);
 let saved=calls.length>n0?"auto-saved":"no request";
 if(calls.length===n0){const sv=page.locator("button").filter({hasText:/^Save( changes)?$/});for(let i=0;i<await sv.count();i++){const b=sv.nth(i);if(await b.isVisible()&&await b.isEnabled()){await b.click();saved="clicked Save";await page.waitForTimeout(3000);break;}}}
 const p=await prefs();return {saved,prefs:p,calls:calls.slice(n0)};};
const linkOf=async deskId=>{for(const q of ['desk_record_id='+deskId,'page_size=200']){const l=await api('GET','/desk/integrations/crm/links?'+q);const m=arr(l.j).find(x=>x.desk_record_id===deskId);if(m)return m;}return null;};
const linkOfCrm=async crmId=>{const l=await api('GET','/desk/integrations/crm/links?page_size=200');return arr(l.j).find(x=>x.crm_record_id===crmId)||null;};
