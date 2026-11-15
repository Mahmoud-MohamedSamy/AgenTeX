const M=JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(),'executions/execu_2026-11-08_desk-automation-order/e1.json'),'utf8'));
await go('/views/all/tickets/'+M.t);await sleep(9000);
await page.getByRole('tab',{name:/History/i}).first().click().catch(()=>page.getByText('HISTORY',{exact:true}).first().click());await sleep(5000);
await shot('e1-history-s6');const hb=(await text()).replace(/\s+/g,' ');const j=hb.search(/Today/);log('history',hb.slice(j,j+900).replace(/mahmoud\.mmohamedsamy/g,'G'));return {ok:1};
