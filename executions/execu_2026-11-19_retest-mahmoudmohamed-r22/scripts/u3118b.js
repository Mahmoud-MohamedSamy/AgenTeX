const {execFileSync}=require('child_process');const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
const run=n=>execFileSync('bash',['x56/runo.sh','r3118-'+n+'.js'],{cwd:'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/scripts',encoding:'utf8'}).replace(/\s+/g,' ').slice(-200);
const cap=async n=>{await page.goto(H+'/views/all/tickets/3bfc4061-4394-41a0-85d9-303fc7f3e53c',{waitUntil:'commit'});await page.getByText('#5526').first().waitFor({timeout:90000}).catch(()=>{});await sleep(8000);const t=await bt();const i=t.indexOf('Steps');R[n]=t.slice(i,i+260);await shot(n+'.png',{timeout:90000});};
R.reopen=run('reopen');await cap('3118-r1-e-5526-reopened');
return R;
