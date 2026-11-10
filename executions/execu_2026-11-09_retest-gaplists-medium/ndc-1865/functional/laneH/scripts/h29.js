const CSV='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneH/evidence/qa-ft-1865-h-contacts.csv';
let step='nav';try{
await page.goto(H+'/settings/data/import',{waitUntil:'load',timeout:120000});await wt(/Choose a module/);await page.waitForTimeout(2000);
step='module';await page.getByText('Choose a module').nth(1).click();await page.waitForTimeout(1000);await page.locator('[role=option]').filter({hasText:/^Contacts$/}).first().click();await page.waitForTimeout(1000);
step='start';const fcP=page.waitForEvent('filechooser',{timeout:15000}).catch(()=>null);await page.getByRole('button',{name:'Start import'}).click();const fc=await fcP;out.chooser=!!fc;
if(fc){await fc.setFiles(CSV);}
const t0=Date.now();let t='';while(Date.now()-t0<60000){t=await body();if(/Map|mapping|column|Next|Continue/i.test(t.slice(t.lastIndexOf('Import history'))))break;await page.waitForTimeout(2000);}
out.url=page.url();out.after=t.split('\n').filter(l=>l.trim()).slice(-45);await shot('d3-import-step2');
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('d-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
