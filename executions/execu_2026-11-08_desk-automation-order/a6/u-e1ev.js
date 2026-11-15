const M=JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(),'executions/execu_2026-11-08_desk-automation-order/e1-ev.json'),'utf8'));
for(const [n,id] of [['A',M.t1],['B',M.t2],['C',M.t3]]){await go('/views/all/tickets/'+id);await sleep(9000);
 await page.getByRole('tab',{name:/History/i}).first().click().catch(()=>page.getByText('HISTORY',{exact:true}).first().click());await sleep(5000);
 await shot('e1ev-'+n+'-history');const hb=(await text()).replace(/\s+/g,' ');const j=hb.search(/Today/);log(n,hb.slice(j,j+700).replace(/mahmoud\.mmohamedsamy/g,'G'));}
await go('/settings/customization/notifications');await sleep(9000);await shot('e1ev-notif');log('notif',(await text()).replace(/\s+/g,' ').slice(1400,2600));
await go('/settings/organization/customer-happiness');await sleep(8000);await shot('e1ev-happy');log('happy',(await text()).replace(/\s+/g,' ').slice(1400,2000));
return {ok:1};
