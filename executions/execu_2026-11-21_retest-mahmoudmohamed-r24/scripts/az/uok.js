const R=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/out/mvctl.json','utf8'));
for(let a=0;a<3;a++){await page.goto(H+'/views/all/tickets/'+R.a,{waitUntil:'commit'});const ok=await page.getByText(/QA RT20 AZ/).first().waitFor({timeout:90000}).then(()=>1,()=>0);if(ok)break;}
await sleep(6000);const h=page.getByText(/^HISTORY$/i).first();await h.click().catch(()=>{});await sleep(6000);await shot('2275-az-2-create-assigned-history.png');
log(((await text()).match(/[^\n]*(round|assign|owner)[^\n]*/gi)||[]).slice(0,10).join(' || '));
