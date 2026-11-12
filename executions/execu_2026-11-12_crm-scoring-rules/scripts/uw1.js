async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 await page.goto('https://staging-crm.taviportal.com/settings/web-forms',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 await page.screenshot({path:EV+'uw1-webforms.png'}); const b=(await page.innerText('body')).replace(/\s+/g,' '); const i=b.indexOf('Web Forms',b.indexOf('Teamspace')); return {url:page.url(), text:b.slice(Math.max(0,b.lastIndexOf('Web Forms')-50), b.lastIndexOf('Web Forms')+600)}; }
