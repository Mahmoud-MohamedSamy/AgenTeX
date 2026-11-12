async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/zoho/';
 await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 await page.locator('text=/^Skills$/').first().click(); await page.waitForTimeout(7000);
 await page.mouse.click(1528, 72); await page.waitForTimeout(3000);
 await page.screenshot({ path: E + 'zoho-skill-preferences.png' }); return 'ok'; }
