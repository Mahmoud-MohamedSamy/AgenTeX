async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 const t=(await page.innerText('main')).replace(/\s+/g,' '); const i=t.indexOf('QA SR1112 G loop'); out.row=i>=0?t.slice(i,i+200):'not found'; await page.screenshot({path:EV+'ug-wf-list.png'});
 await page.goto('https://staging-crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/52235358-3495-4240-a528-7cedb6fb2b98',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 const tl=page.getByRole('tab',{name:/Timeline/}).first(); if(await tl.count()){await tl.click(); await page.waitForTimeout(3000);}
 const b=(await page.innerText('body')).replace(/\s+/g,' '); out.runs=(b.match(/QA SR1112 G loop/g)||[]).length; out.scoreLines=(b.match(/Score was updated from -?\d+ to -?\d+/g)||[]); await page.screenshot({path:EV+'ug-g10-timeline.png'}); return out; }
