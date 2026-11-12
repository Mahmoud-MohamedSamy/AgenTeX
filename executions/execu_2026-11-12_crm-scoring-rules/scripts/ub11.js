async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; let block=true; await page.route('**/api/v1/scoring-rules*', r=>block?r.abort():r.continue());
 await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 out.failed=(await page.innerText('main')).replace(/\s+/g,' ').slice(-200); await page.screenshot({path:EV+'ub11-load-failed.png'});
 block=false; const tr=page.getByRole('button',{name:/Try again/}); out.hasRetry=await tr.count(); if(out.hasRetry){await tr.first().click(); await page.waitForTimeout(4000);} out.afterRetry=(await page.innerText('main')).replace(/\s+/g,' ').slice(-200);
 await page.unroute('**/api/v1/scoring-rules*'); return out; }
