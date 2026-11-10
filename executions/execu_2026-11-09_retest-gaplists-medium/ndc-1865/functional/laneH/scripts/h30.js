const CSV='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneH/evidence/qa-ft-1865-h-contacts.csv';
const stepText=async()=>{const t=await body();const i=t.lastIndexOf('Upload\n2');return t.slice(i>0?i:Math.max(0,t.length-2500)).split('\n').filter(l=>l.trim()).slice(0,60);};
let step='nav';out.steps={};try{
await page.goto(H+'/settings/data/import',{waitUntil:'load',timeout:120000});await wt(/Choose a module/);await page.waitForTimeout(2000);
step='module';await page.getByText('Choose a module').nth(1).click();await page.waitForTimeout(1000);await page.locator('[role=option]').filter({hasText:/^Contacts$/}).first().click();await page.waitForTimeout(800);
step='start';await page.getByRole('button',{name:'Start import'}).click();await wt(/Upload your file/);await page.waitForTimeout(1000);
step='upload';const fis=page.locator('input[type=file]');out.fileInputs=await fis.count();await fis.last().setInputFiles(CSV);await page.waitForTimeout(4000);
const em=page.getByLabel('Email me when the import finishes');if(await em.count()){out.emailMeChecked=await em.isChecked();if(out.emailMeChecked)await em.uncheck();}
out.steps.upload=await stepText();await shot('d4-import-upload');
for(const s of ['operation','map','assign','review']){step=s;const nx=page.getByRole('button',{name:/^(Next|Continue)$/}).last();await nx.click({timeout:15000});await page.waitForTimeout(5000);out.steps[s]=await stepText();await shot('d5-import-'+s);}
}catch(e){out.err=step+': '+String(e).slice(0,160);await shot('d-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
