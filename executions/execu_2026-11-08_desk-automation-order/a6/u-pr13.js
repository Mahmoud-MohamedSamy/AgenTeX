// OR-13 evidence: ticket (no owner, SLA applied), its History, and the round-robin rule's condition.
const M=JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(),'executions/execu_2026-11-08_desk-automation-order/pr13.json'),'utf8'));
await go('/views/all/tickets/'+M.id);await page.getByText('QA AO PB '+M.pname.split(' ').pop()).first().waitFor({timeout:60000}).catch(()=>{});await sleep(8000);
await shot('pr13-ticket');log('ticket',(await text()).replace(/\s+/g,' ').slice(0,1500));
await page.getByRole('tab',{name:/History/i}).first().click().catch(()=>page.getByText('HISTORY',{exact:true}).first().click());await sleep(5000);
await shot('pr13-history');const hb=(await text()).replace(/\s+/g,' ');const j=hb.search(/Today/);log('history',hb.slice(j,j+1200));
await go('/settings/automation/assignment-rules/'+M.rr);await sleep(9000);await shot('pr13-rule');log('rule',(await text()).replace(/\s+/g,' ').slice(0,1500));
return {ok:1};
