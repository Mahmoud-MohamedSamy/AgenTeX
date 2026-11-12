async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/zoho/';
 await page.mouse.click(1529, 72); await page.waitForTimeout(3500);
 await page.screenshot({ path: E + 'zoho-skill-preferences.png' }); return 'ok'; }
