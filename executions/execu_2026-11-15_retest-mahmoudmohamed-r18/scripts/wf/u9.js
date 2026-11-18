await wiz('QA RT18 WF 2948 probe');await openCond();
log('opbtn',await main.getByRole('button',{name:'Operator'}).count(), 'rm',await main.locator('button[aria-label="Remove condition"]').count());
log('aria',await main.locator('[aria-label]').evaluateAll(a=>a.map(x=>x.getAttribute('aria-label')).filter((v,i,s)=>s.indexOf(v)===i).slice(0,40)));
await setCond(0,'Subject','starts with','QA RT18 WF 2948 ');
log('c',(await main.innerText()).split('CONDITION')[1]?.slice(0,400).replace(/\s+/g,' '));
await shot('wf-probe-cond2.png');return {};
