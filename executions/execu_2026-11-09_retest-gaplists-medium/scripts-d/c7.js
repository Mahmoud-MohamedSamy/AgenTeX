const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2628/ledger.md';const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const I=JSON.parse(fs.readFileSync('../ndc-2628/ids.json','utf8'));const {L,R}=I;const D='../ndc-2628/evidence/raw/';const o={};
const resp=[];page.on('response',async r=>{const q=r.request();const u=r.url();if(u.includes('/api/v1/')&&q.method()!=='GET'&&!/resolved-batch|realtime|heartbeat|iam\/auth|proofing/.test(u)){let t='';try{t=(await r.text()).slice(0,200)}catch(e){}resp.push(q.method()+' '+u.split('/api/v1')[1].slice(0,100)+' → '+r.status()+' '+t);}});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+L+'/records/new?clone_from='+R+'&layout=bf971461-2edc-45f2-b6e4-6e180aa64288&clone_subforms=1&clone_tags=1',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.screenshot({path:D+'clone-form.png'});
const vals=await page.locator('input:visible').evaluateAll(a=>a.map(x=>x.value).filter(Boolean).slice(0,10));o.prefilled=vals;
const sv=page.getByRole('button',{name:/^save$/i});o.save=await sv.count();
if(o.save){await sv.first().click();await page.waitForTimeout(8000);}
o.after=page.url().replace(H,'');await page.screenshot({path:D+'clone-saved.png'});
const created=resp.find(x=>/^POST \/modules\/[^/]+\/records → 20/.test(x));if(created){const id=(created.match(/"id":"([0-9a-f-]{36})"/)||[])[1];o.cloneId=id;LED('CREATE clone lead (UI Clone → Save) '+id);fs.writeFileSync('../ndc-2628/ids.json',JSON.stringify({...I,CLONE:id},null,1));}
o.resp=resp.slice(0,6);return o;
