async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/settings/audit-log',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
 const t=(await page.innerText('body')).replace(/\s+/g,' '); out.mentions=(t.match(/[^.]{0,80}[Ss]coring[^.]{0,80}/g)||[]).slice(0,6); await page.screenshot({path:EV+'ua-audit.png'});
 await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
 out.empty=(await page.innerText('body')).replace(/\s+/g,' ').slice(-300); await page.screenshot({path:EV+'ub3-empty.png'});
 await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=00000000-0000-0000-0000-000000000009',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000); out.badModule=(await page.innerText('body')).replace(/\s+/g,' ').slice(-250); await page.screenshot({path:EV+'ub10-bad-module.png'});
 return out; }
