const R=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/out/ctl.json','utf8'));
await page.goto(H+'/views/all/tickets/'+R.t,{waitUntil:'commit'});await page.getByText(/QA RT20 AZ/).first().waitFor({timeout:120000}).catch(()=>{});await sleep(6000);
const h=page.getByText(/^HISTORY$/i).first();await h.click().catch(()=>{});await sleep(5000);await shot('2275-az-1-control-history.png');
log(((await text()).match(/[^\n]*(owner|assign|Unassigned|round|created)[^\n]*/gi)||[]).slice(0,12).join(' || '));
