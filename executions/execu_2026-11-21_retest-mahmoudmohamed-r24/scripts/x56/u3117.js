const {execFileSync}=require('child_process');const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/5c68004d-860c-4bcd-b6b8-77e0bce5c044',{waitUntil:'commit'});await page.getByText('#5117').first().waitFor({timeout:90000}).catch(()=>{});await sleep(7000);
let t=await bt();R.shownBefore=/QA end/.test(t);await shot('3117-r1-a-step-offered.png',{timeout:90000});
R.low=execFileSync('node',['apiw.js','o','C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/p-low.js'],{cwd:'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r21/scripts',env:{...process.env,APP:'desk'},encoding:'utf8'}).replace(/\s+/g,' ').slice(-120);
const btn=page.getByRole('button',{name:/QA end/}).first();R.btn=await btn.count();
if(R.btn){await btn.click();await sleep(2500);t=await bt();R.afterClick1=t.slice(0,0);
 const run=page.getByRole('button',{name:/^(Run|Confirm|Save|Continue|Proceed)/}).last();if(await run.count()&&await run.isVisible().catch(()=>false)){await run.click().catch(()=>{});}
 await sleep(3000);t=await bt();const k=t.search(/meet|condition|owner|not allowed|refused/i);R.msg=k>=0?t.slice(Math.max(0,k-150),k+250):'(no message found)';await shot('3117-r1-b-stale-run.png',{timeout:90000});}
await page.reload({waitUntil:'commit'});await page.getByText('#5117').first().waitFor({timeout:90000}).catch(()=>{});await sleep(7000);t=await bt();R.shownAfterReload=/QA end/.test(t);R.state=(t.match(/Escalated|Closed/)||[])[0];await shot('3117-r1-c-after-reload.png',{timeout:90000});
return R;
