async (page) => { await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 await page.screenshot({path:'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/u1-list.png'});
 return {url:page.url(), text:(await page.innerText('main').catch(()=>page.innerText('body'))).replace(/\s+/g,' ').slice(0,1500)}; }
