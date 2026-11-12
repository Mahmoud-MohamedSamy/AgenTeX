async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 await page.mouse.click(490,530); await page.waitForTimeout(1200);
 await page.screenshot({path:EV+'uw7-build.png'}); const b=(await page.innerText('body')).replace(/\s+/g,' '); const i=b.indexOf('PREVIEW'); return b.slice(i,i+300); }
