async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const who=process.env.WHO||'x'; await page.goto('https://staging-crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/611bb459-0689-4cfa-b9f1-998ae2b0c5d2',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
 const t=(await page.innerText('body')).replace(/\s+/g,' '); const hits=[]; let i=-1; while((i=t.indexOf('Score',i+1))>=0 && hits.length<6) hits.push(t.slice(Math.max(0,i-60),i+60));
 const el=page.getByText(/^Score$/).first(); if(await el.count()){await el.scrollIntoViewIfNeeded().catch(()=>{});}
 await page.screenshot({path:EV+'uf1-record-lowpriv.png'}); return {url:page.url(), hits}; }
