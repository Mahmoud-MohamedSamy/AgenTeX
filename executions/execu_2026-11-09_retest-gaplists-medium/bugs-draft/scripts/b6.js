const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/ledger.md';
const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/evidence/raw/';
const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4',C='daf6afa2-d952-41f6-afbb-f7223e49408a',T='372b88df-6733-4c61-a774-0202a0148fd5';const out={blocked:[]};
const body={data:[{field:'email',value:{kind:'string',value:'qa.rt.bug@anyware.software'}}]};
let u=await api('PATCH',`/modules/${CT}/records/${C}`,body);if(u.s>=300){out.patch=u.s;u=await api('PUT',`/modules/${CT}/records/${C}`,body);}
out.update=u.s;out.updErr=u.s>=300?u.t.slice(0,200):undefined;fs.appendFileSync(L,`- ${new Date().toISOString()} UPDATED contact ${C} email → qa.rt.bug@anyware.software (control) → ${u.s}\n`);
await page.route('**/api/v1/**',r=>{const m=r.request().method();const x=r.request().url();if(m!=='GET'&&(m!=='POST'||/repl|send|draft|thread|mail|forward|comment/i.test(x))){out.blocked.push(m+' '+x.replace(/.*api\/v1/,'').slice(0,80));return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
await page.locator('button').filter({hasText:/^Reply All|^Reply/}).first().click({timeout:20000});await page.waitForTimeout(6000);
out.chips=await page.locator('.eti-chip-label').allInnerTexts();
await page.screenshot({path:D+'b1-composer-control-valid.png'});
await page.locator('button').filter({hasText:/^Cancel$/}).first().click({timeout:5000}).catch(()=>{});
return out;
