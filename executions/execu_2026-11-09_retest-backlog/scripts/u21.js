const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const fs=require('fs');const LED=m=>fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const o={};await page.setViewportSize({width:1600,height:900});const writes=[];
page.on('request',r=>{if(/api\/v1/.test(r.url())&&!['GET','OPTIONS'].includes(r.method())&&!/heartbeat|resolved-batch|iam\/auth|realtime/.test(r.url()))writes.push(r.method()+' '+r.url().replace(/.*api\/v1/,'')+' '+(r.postData()||'').slice(0,800));});
page.on('response',async r=>{if(/api\/v1/.test(r.url())&&!['GET','OPTIONS'].includes(r.request().method())&&!/heartbeat|resolved-batch|realtime/.test(r.url()))writes.push('  -> '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300));});
await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('Ticket Status',{exact:true}).last().waitFor({timeout:150000});await sleep(2000);
await page.getByText('Ticket Status',{exact:true}).last().click();
const h=page.getByText('Statuses by department and layout',{exact:true}).first();await h.waitFor({timeout:90000});
const sels=page.locator('select');await sels.nth(1).selectOption({label:'QA RT9 2174 Dept'});await sleep(3000);
await sels.nth(2).selectOption({label:'QA RT9 2174 Layout'});await sleep(3000);
await page.getByText('Use only the statuses picked below',{exact:true}).click();await sleep(2000);
const card=page.getByTestId('desk-layout-statuses');
const keep=['Open','Escalated','Closed'];
const rows=card.locator('label:has(input[type=checkbox])');const n=await rows.count();o.n=n;let un=0;
for(let i=0;i<n;i++){const row=rows.nth(i);const t=(await row.innerText()).trim();const cb=row.locator('input[type=checkbox]');if(!keep.includes(t)&&await cb.isChecked()){await cb.uncheck();un++;}}
o.unchecked=un;
// default -> Escalated
const escRow=card.locator('label:has(input[type=checkbox])',{hasText:/^\s*Escalated\s*$/}).first().locator('xpath=ancestor::*[.//input[@type="radio"]][1]');
await escRow.locator('input[type=radio]').first().check().catch(e=>o.defErr=e.message.slice(0,100));await sleep(1000);
o.after=(await card.innerText()).split('Use only the statuses picked below').pop().slice(0,1500);
await card.scrollIntoViewIfNeeded();await page.screenshot({path:SS+'2174-10e-before-save.png'});
await card.getByRole('button',{name:'Save',exact:true}).click();await sleep(6000);
await page.screenshot({path:SS+'2174-10f-after-save.png'});
o.toast=(await page.innerText('body')).match(/[^\n]*(saved|error|failed|could not)[^\n]*/gi);
o.writes=writes;LED('NDC-2174 layout QA RT9 2174 Layout ticket statuses narrowed via UI (Open, Escalated, Closed; default Escalated)');
return o;
