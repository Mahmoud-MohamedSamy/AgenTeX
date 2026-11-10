const CSV='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneH/evidence/qa-ft-1865-h-contacts.csv';
const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const main=async()=>{const t=await body();return t.split('\n').filter(l=>l.trim()).slice(-30);};
let step='nav';out.steps={};try{
await page.goto(H+'/settings/data/import',{waitUntil:'load',timeout:120000});await wt(/Choose a module/);await page.waitForTimeout(2000);
step='module';await page.getByText('Choose a module').nth(1).click();await page.waitForTimeout(1000);await page.locator('[role=option]').filter({hasText:/^Contacts$/}).first().click();await page.waitForTimeout(800);
step='start';await page.getByRole('button',{name:'Start import'}).click();await wt(/Upload your file/);await page.waitForTimeout(1000);
step='upload';await page.locator('input[type=file]').last().setInputFiles(CSV);await page.waitForTimeout(4000);
const em=page.getByLabel('Email me when the import finishes');if(await em.count()&&await em.isChecked())await em.uncheck();
for(const s of ['operation','map']){step=s;await page.getByRole('button',{name:/^Next$/}).last().click({timeout:15000});await page.waitForTimeout(5000);}
step='assign';await wt(/Assign & approve/);await page.getByRole('button',{name:/Save & next/}).click({timeout:15000});await page.waitForTimeout(6000);
out.steps.review=await main();await shot('d6-import-review');
step='run';const run=page.getByRole('button',{name:/^(Import|Start import|Run import|Run|Confirm|Start)$/}).last();out.runLabel=await run.innerText().catch(()=>null);await run.click({timeout:15000});
await wt(/Result|imported|completed|finished|Undo/i,120000);await page.waitForTimeout(8000);out.steps.result=await main();await shot('d7-import-result');
}catch(e){out.err=step+': '+String(e).slice(0,160);await shot('d-err-'+step);}
const c=await api('GET',`/modules/${CT}/records?pageSize=10&q=QA%20FT%201865%20H%20Import`);const recs=arr(c.j).map(x=>({id:x.id,n:((x.data||[]).find(z=>z.field==='last_name')||{}).value}));out.imported=recs.map(r=>r.id+' '+JSON.stringify(r.n&&r.n.value));
for(const r of recs)log(`CREATED contact ${r.id} via import (${r.n&&r.n.value})`);
return Object.assign(out,{calls:[...new Set(calls)]});
