const R=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/out/ctl3.json','utf8'));
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.getByText(/Round Robin|Round robin/).first().waitFor({timeout:120000});await sleep(5000);
const rr=page.getByText(/^Round Robin$|^Round robin$/).first();await rr.click().catch(()=>{});await sleep(3000);
// choose department QA AO Dept B if a picker exists
const dp=page.getByRole('combobox').first();if(await dp.count()){await dp.click().catch(()=>{});await sleep(1000);const op=page.getByRole('option',{name:/QA AO Dept B/}).first();if(await op.count()){await op.click();await sleep(3000);}else await page.keyboard.press('Escape');}
const row=page.getByText(/QA RT20 AS control owner/).first();if(await row.count())await row.scrollIntoViewIfNeeded();await sleep(1500);
log('rules page has control rule: '+await row.count());await shot('2275-3-rr-rules-aob.png');
await page.goto(H+'/views/all/tickets/'+R.t,{waitUntil:'commit'});await page.getByText(/QA RT20 AS/).first().waitFor({timeout:120000}).catch(()=>{});await sleep(6000);
await shot('2275-4-control-ticket.png');
const h=page.getByText(/^HISTORY$/i).first();await h.click().catch(()=>{});await sleep(4000);await shot('2275-5-control-ticket-history.png');
log(((await text()).match(/[^\n]*(owner|assign|Unassigned|round)[^\n]*/gi)||[]).slice(0,10).join(' || '));
