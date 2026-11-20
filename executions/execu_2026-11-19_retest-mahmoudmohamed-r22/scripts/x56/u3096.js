const {execFileSync}=require('child_process');const W='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/scripts';
const T=JSON.parse(require('fs').readFileSync(W+'/../out/3096.json','utf8'));const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/'+T.id,{waitUntil:'commit'});await page.getByText('QA RT22 BS 3096').first().waitFor({timeout:120000});await sleep(5000);await shot('3096-r1-a-open.png',{timeout:90000});
R.move=execFileSync('bash',['x56/runo.sh','m3096.js'],{cwd:W,encoding:'utf8'}).replace(/\s+/g,' ').slice(-30);
for(const s of [5,15,30]){await sleep(s===5?5000:(s===15?10000:15000));const t=await bt();R['at'+s]=(t.match(/.{0,80}(moved|not available|Permission|stay on this ticket|Exit).{0,160}/i)||[])[0];await shot('3096-r1-b-after-'+s+'s.png',{timeout:90000});}
return R;
