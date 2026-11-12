async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 await page.screenshot({path:EV+'ul1-lowpriv-direct.png'}); const t=(await page.innerText('body')).replace(/\s+/g,' '); return {url:page.url(), hasMenu:/Scoring Rules/.test(t), text:t.slice(0,200)+' ... '+t.slice(t.indexOf('Scoring Rules')-50, t.indexOf('Scoring Rules')+300)}; }
